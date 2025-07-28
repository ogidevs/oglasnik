import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser, updateUser } from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({ email: '', role: '' });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      const { data } = await getAllUsers({ page, size: 10 });
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error('Greška pri učitavanju korisnika');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditFormData({ email: user.email, role: user.role });
  };

  const handleCancelClick = () => setEditingUserId(null);

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async (id) => {
    await toast.promise(updateUser(id, editFormData), {
      loading: 'Ažuriranje...',
      success: 'Uspešno ažurirano',
      error: 'Greška pri ažuriranju',
    });
    setEditingUserId(null);
    fetchUsers();
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Sigurno?")) {
      await toast.promise(deleteUser(id), {
        loading: 'Brisanje...',
        success: 'Uspešno obrisano',
        error: 'Greška pri brisanju',
      });
      fetchUsers();
    }
  };

  return (
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
                    <input name="email" value={editFormData.email} onChange={handleEditFormChange} className="p-1 border rounded w-full" />
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Prethodna</button>
        <span>Stranica {page + 1} od {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))} disabled={page >= totalPages - 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Sledeća</button>
      </div>
    </div>
  );
};

export default AdminUserManagement;
