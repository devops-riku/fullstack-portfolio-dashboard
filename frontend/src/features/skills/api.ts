import { apiClient } from '../../api/client';

export interface Skill {
    id: number;
    name: string;
    icon_name: string;
    category: string;
}

export interface SkillCreate {
    name: string;
    icon_name: string;
    category: string;
}

export const getSkills = async (): Promise<Skill[]> => {
    const response = await apiClient.get('/skills');
    return response.data;
};

export const createSkill = async (skill: SkillCreate): Promise<Skill> => {
    const response = await apiClient.post('/skills', skill);
    return response.data;
};

export const deleteSkill = async (id: number): Promise<void> => {
    await apiClient.delete(`/skills/${id}`);
};

export const updateSkill = async (id: number, skill: SkillCreate): Promise<Skill> => {
    const response = await apiClient.put(`/skills/${id}`, skill);
    return response.data;
};
