import api from '../api/api';

export const getAllUsers = () => api.get('/admin/users');
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const updateUser = (id, userData) => api.put(`/admin/users/${id}`, userData);
export const getUserInfo = () => api.get('/users/me');