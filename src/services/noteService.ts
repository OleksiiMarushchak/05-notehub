import axios from "axios";

import type { AxiosResponse } from "axios";
import type  { Note } from "../types//note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});


export async function fetchNotes<FetchNotesResponse>(
  search: string,
  page: number,
  perPage = 12
): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> =
    await api.get("/notes", {
      params: { search, page, perPage, sortBy: "created" },
    });

  return response.data;
}

export async function createNote(
  title: string,
  content: string,
  tag: string
): Promise<Note> {
  const response: AxiosResponse<Note> = await api.post("/notes", {
    title,
    content,
    tag,
  });

  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return response.data;
}
