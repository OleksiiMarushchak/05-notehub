import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note } from "../types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

export async function fetchNotes(
  search: string,
  page: number,
  perPage = 12
): Promise<{ notes: Note[]; totalPages: number }> {
  const response: AxiosResponse<{
    notes: Note[];
    totalPages: number;
  }> = await api.get("/notes", {
    params: {
      search,
      page,
      perPage,
      sortBy: "created",
    },
  });

  return response.data;
}

export async function createNote(
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> {
  const response: AxiosResponse<Note> =
    await api.post("/notes", note);

  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response: AxiosResponse<Note> =
    await api.delete(`/notes/${id}`);

  return response.data;
}
