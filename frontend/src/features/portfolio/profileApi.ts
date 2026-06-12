import { apiClient } from '../../api/client';

export interface Profile {
    id: number;
    full_name: string;
    title: string;
    bio: string;
    email: string;
    github_url: string;
    linkedin_url: string;
    avatar_url: string;
}

export const getProfile = async (): Promise<Profile> => {
    const response = await apiClient.get('/profile');
    return response.data;
};

export const updateProfile = async (profile: Partial<Profile>): Promise<Profile> => {
    // Remove ID if present to match backend schema expectations
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...data } = profile;
    const response = await apiClient.put('/profile', data);
    return response.data;
};

export const generateAiBio = async (bio: string): Promise<{ bio: string }> => {
    const response = await apiClient.post('/profile/ai-bio', { bio });
    return response.data;
};
