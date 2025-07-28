import api from '../api/api';

export const uploadFiles = (files) => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });
    return api.post('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};