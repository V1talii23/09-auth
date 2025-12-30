import type { Note, CreateNoteData } from '@/types/note';
import { User } from '@/types/user';
import { nextServer } from './api';
import { SessionCheck } from '@/types/auth';

const URL = '/notes';

interface HttpsResponse {
  notes: Note[];
  totalPages: number;
}

interface UserData {
  email: string;
  password: string;
}

const getNotes = async (search: string, page: number, tag?: string) => {
  const { data } = await nextServer.get<HttpsResponse>(URL, {
    params: { page, perPage: 12, search, tag },
  });
  return data;
};

const getNoteById = async (id: string) => {
  const { data } = await nextServer.get<Note>(`${URL}/${id}`);
  return data;
};

const createNote = async (newNote: CreateNoteData) => {
  const { data } = await nextServer.post<Note>(URL, newNote);
  return data;
};

const deleteNote = async (id: Note['id']) => {
  const { data } = await nextServer.delete<Note>(`${URL}/${id}`);
  return data;
};

const register = async (user: UserData) => {
  const { data } = await nextServer.post<User>('/auth/register', user);
  return data;
};

const login = async (user: UserData) => {
  const { data } = await nextServer.post<User>('/auth/login', user);
  return data;
};

const logout = async () => {
  await nextServer.post('/auth/logout');
};

const checkSession = async () => {
  const { data } = await nextServer.get<SessionCheck>('/auth/session');
  return data.success;
};

const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

const updateMe = async (userData: User) => {
  const { data } = await nextServer.patch<User>('users/me', userData);
  return data;
};

export {
  getNotes,
  createNote,
  deleteNote,
  getNoteById,
  register,
  login,
  logout,
  checkSession,
  getMe,
  updateMe,
};
