import { apiClient } from '../../api/client';

export interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  github_link: string;
  highlights: string[];
  tags: string[];
  owner_id: number;
}

export type ProjectCreate = Omit<Project, 'id' | 'owner_id'>;

export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get('/projects');
  return response.data;
};

export const createProject = async (project: ProjectCreate): Promise<Project> => {
  const response = await apiClient.post('/projects', project);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await apiClient.delete(`/projects/${id}`);
};

export const updateProject = async (id: number, project: Partial<ProjectCreate>): Promise<Project> => {
  const response = await apiClient.put(`/projects/${id}`, project);
  return response.data;
};
