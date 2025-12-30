import type { Note } from '@/types/note';
import { nextServer } from './api';
import { SessionCheck } from '@/types/auth';
import { User } from '@/types/user';

import { cookies } from 'next/headers';

const URL = '/notes';

interface HttpsResponse {
  notes: Note[];
  totalPages: number;
}

const getNotesServer = async (search: string, page: number, tag?: string) => {
  const cookie = await cookies();
  const { data } = await nextServer.get<HttpsResponse>(`${URL}`, {
    params: { page, perPage: 12, search, tag },
    headers: { Cookie: cookie.toString() },
  });
  return data;
};

const getNoteByIdServer = async (id: string) => {
  const cookie = await cookies();
  const { data } = await nextServer.get<Note>(`${URL}/${id}`, {
    headers: { Cookie: cookie.toString() },
  });
  return data;
};

const checkSessionServer = async () => {
  const cookie = await cookies();
  const res = await nextServer.get<SessionCheck>('/auth/session', {
    headers: { Cookie: cookie.toString() },
  });
  return res;
};

const getMeServer = async () => {
  const cookie = await cookies();
  const { data } = await nextServer.get<User>('/users/me', {
    headers: { Cookie: cookie.toString() },
  });
  return data;
};

export { getNotesServer, getNoteByIdServer, checkSessionServer, getMeServer };
