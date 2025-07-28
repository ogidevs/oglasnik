import api from '../api/api';

export const getAllAds = (params) => api.get('/ads', { params });
export const getAdById = (id) => api.get(`/ads/${id}`);
export const createAd = (adData) => api.post('/ads', adData);
export const updateAd = (id, adData) => api.put(`/ads/${id}`, adData);
export const deleteAd = (id) => api.delete(`/ads/${id}`);
export const getMyAds = () => api.get('/users/me/ads');