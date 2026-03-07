import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Experience {
    id: number;
    role: string;
    company: string;
    period: string;
    description: string;
    owner_id: number;
}

export type ExperienceCreate = Omit<Experience, 'id' | 'owner_id'>;

export const getExperiences = async (): Promise<Experience[]> => {
    const response = await apiClient.get('/experiences');
    return response.data;
};

export const createExperience = async (experience: ExperienceCreate): Promise<Experience> => {
    const response = await apiClient.post('/experiences', experience);
    return response.data;
};

export const deleteExperience = async (id: number): Promise<void> => {
    await apiClient.delete(`/experiences/${id}`);
};

export const updateExperience = async (id: number, experience: ExperienceCreate): Promise<Experience> => {
    const response = await apiClient.put(`/experiences/${id}`, experience);
    return response.data;
};
