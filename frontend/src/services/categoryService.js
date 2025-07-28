import api from '../api/api';

export const getAllCategories = () => api.get('/categories');
export const createCategory = (categoryData) => api.post('/admin/categories', categoryData);
export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`);