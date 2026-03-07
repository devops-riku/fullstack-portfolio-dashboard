import axios from 'axios';

const API_URL = 'http://localhost:8000/api/skills';

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
    const response = await axios.get(API_URL);
    return response.data;
};

export const createSkill = async (skill: SkillCreate): Promise<Skill> => {
    const token = localStorage.getItem('token');
    const response = await axios.post(API_URL, skill, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteSkill = async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateSkill = async (id: number, skill: SkillCreate): Promise<Skill> => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/${id}`, skill, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
