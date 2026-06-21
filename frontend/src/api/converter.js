import api, { API_BASE_URL } from './api';

// 1. Jwenn lis fòma ki disponib yo
export const getFormats = async () => {
    const response = await api.get('/convert/formats');
    return response.data;
};

// 2. Konvèti yon dokiman
export const convertDocument = async (file, targetFormat) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_format', targetFormat);

    const response = await api.post('/convert/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getDownloadUrl = (job_id, filename) => {
    return `${API_BASE_URL}/convert/download/${job_id}/${filename}`;
};

export const deleteJobFile = async (job_id, filename) => {
    await api.delete(`/convert/jobs/${job_id}/${filename}`);
};

export const getHealth = async () => {
    const response = await api.get('/health');
    return response.data;
};
