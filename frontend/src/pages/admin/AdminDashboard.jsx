import React, { useState, useEffect, useCallback } from 'react';
import { getAllUsers, deleteUser, updateUser } from '../../services/adminService';
import { createCategory, getAllCategories, deleteCategory } from '../../services/categoryService';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, reset } = useForm();
    
    // State za inline editovanje
    const [editingUserId, setEditingUserId] = useState(null);
    const [editFormData, setEditFormData] = useState({ email: '', role: '' });

    const fetchData = useCallback(async () => {
        try {
            const [userRes, catRes] = await Promise.all([getAllUsers(), getAllCategories()]);
            setUsers(userRes.data);
            setCategories(catRes.data);
        } catch (error) {}
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchData().finally(() => setLoading(false));
    }, [fetchData]);

    const handleEditClick = (user) => {
        setEditingUserId(user.id);
        setEditFormData({ email: user.email, role: user.role });
    };

    const handleCancelClick = () => {
        setEditingUserId(null);
    };

    const handleEditFormChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };
    
    const handleUpdateUser = async (userId) => {
        await toast.promise(updateUser(userId, editFormData), {
            loading: 'Ažuriranje korisnika...',
            success: 'Korisnik ažuriran.',
        });
        setEditingUserId(null);
        fetchData();
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Sigurno?")) {
            await toast.promise(deleteUser(id), {
                loading: 'Brisanje korisnika...',
                success: 'Korisnik obrisan.',
            });
            fetchData();
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm("Sigurno?")) {
            await toast.promise(deleteCategory(id), {
                loading: 'Brisanje kategorije...',
                success: 'Kategorija obrisana.',
            });
            fetchData();
        }
    };
    
    const onAddCategory = async (data) => {
        await toast.promise(createCategory(data), {
            loading: 'Dodavanje kategorije...',
            success: 'Kategorija dodata.',
        });
        reset();
        fetchData();
    };
    
    if (loading) return <Spinner />;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Management */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Upravljanje korisnicima</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Username</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Uloga</th>
                            <th className="p-2">Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b">
                                {editingUserId === user.id ? (
                                    <>
                                        <td className="p-2">{user.username}</td>
                                        <td className="p-2">
                                            <input type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} className="p-1 border rounded w-full" />
                                        </td>
                                        <td className="p-2">
                                            <select name="role" value={editFormData.role} onChange={handleEditFormChange} className="p-1 border rounded w-full">
                                                <option value="ROLE_USER">USER</option>
                                                <option value="ROLE_ADMIN">ADMIN</option>
                                            </select>
                                        </td>
                                        <td className="p-2 flex space-x-2">
                                            <button onClick={() => handleUpdateUser(user.id)} className="text-green-500">Sačuvaj</button>
                                            <button onClick={handleCancelClick} className="text-gray-500">Otkaži</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-2">{user.username}</td>
                                        <td className="p-2">{user.email}</td>
                                        <td className="p-2">{user.role.replace('ROLE_', '')}</td>
                                        <td className="p-2 flex space-x-2">
                                            <button onClick={() => handleEditClick(user)} className="text-blue-500">Izmeni</button>
                                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-500">Obriši</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Category Management */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Upravljanje kategorijama</h2>
                <form onSubmit={handleSubmit(onAddCategory)} className="flex space-x-2 mb-4">
                    <input {...register('naziv', { required: true })} placeholder="Novi naziv kategorije" className="flex-grow p-2 border rounded-md" />
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Dodaj</button>
                </form>
                <ul className="space-y-2">
                    {categories.map(cat => (
                        <li key={cat.id} className="flex justify-between items-center p-2 border rounded">
                            <span>{cat.naziv}</span>
                            <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500">Obriši</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;