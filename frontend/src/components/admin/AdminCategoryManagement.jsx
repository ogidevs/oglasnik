import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createCategory, deleteCategory, getAllCategories } from '../../services/categoryService';
import toast from 'react-hot-toast';

const AdminCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const fetchCategories = async () => {
    try {
      const { data } = await getAllCategories();
      setCategories(data);
    } catch (err) {
      toast.error('Greška pri učitavanju kategorija');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onAddCategory = async (data) => {
    await toast.promise(createCategory(data), {
      loading: 'Dodavanje...',
      success: 'Kategorija dodata',
      error: 'Greška',
    });
    reset();
    fetchCategories();
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Sigurno?")) {
      await toast.promise(deleteCategory(id), {
        loading: 'Brisanje...',
        success: 'Kategorija obrisana',
        error: 'Greška pri brisanju',
      });
      fetchCategories();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Upravljanje kategorijama</h2>
      <form onSubmit={handleSubmit(onAddCategory)} className="flex space-x-2 mb-4">
        <input {...register('naziv', { required: true })} placeholder="Nova kategorija" className="flex-grow p-2 border rounded-md" />
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
  );
};

export default AdminCategoryManagement;
