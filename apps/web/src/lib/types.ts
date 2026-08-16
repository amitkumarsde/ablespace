export type Status = 'To Do' | 'Doing' | 'Completed' | 'On Hold';
export type Priority = 'No Priority' | 'Urgent' | 'High' | 'Medium' | 'Low';

export interface Resource {
  label: string;
  url?: string;
}

export interface Subtask {
  _id?: string;
  title: string;
  priority: Priority;
  members: string[];
  dueDate?: string | null;
}

export interface Reply {
  _id: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  createdAt: string;
  replies: Reply[];
}

export interface Update {
  _id: string;
  actorName: string;
  actorAvatar?: string;
  text: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  projectId?: string | null;
  status: Status;
  priority: Priority;
  members: string[];
  teams: string[];
  labels: string[];
  startDate?: string | null;
  dueDate?: string | null;
  reporter: string;
  resources: Resource[];
  subtasks: Subtask[];
  comments: Comment[];
  updates: Update[];
  owner: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  priority: Priority;
  lead: string;
  members: string[];
  dueDate?: string | null;
  owner: string;
  order: number;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  title?: string;
  username?: string;
  isGuest: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}
