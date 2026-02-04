import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import styles from "./App.module.css";

import { fetchNotes, createNote, deleteNote } from "../../services/noteService";

import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";

import type {
  NoteFormValues,
} from "../../types/note";

export default function App() {
    const queryClient = useQueryClient();

    // 🔍 search
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    // 📄 pagination
    const [page, setPage] = useState(1);

    // 🪟 modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const debouncedSearch = useDebouncedCallback((value: string) => {
        setSearch(value);
        setPage(1);
    }, 500);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["notes", search, page],
        queryFn: () => fetchNotes(search, page),
        keepPreviousData: true,
    });

    const createMutation = useMutation({
        mutationFn: (values: NoteFormValues) =>
            createNote(values.title, values.content, values.tag),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notes"],
            });
            setIsModalOpen(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notes"],
            });
        },
    });

    return (
        <div className={styles.app}>
            <header className={styles.toolbar}>
                <SearchBox
                    value={searchInput}
                    onChange={(value) => {
                        setSearchInput(value);
                        debouncedSearch(value);
                    }}
                />

                <Pagination
                    pageCount={data?.totalPages ?? 0}
                    currentPage={page}
                    onPageChange={({ selected }) => setPage(selected + 1)}
                />

                <button
                    className={styles.button}
                    onClick={() => setIsModalOpen(true)}
                >
                    Create note +
                </button>
            </header>

            {isLoading && <p>Loading...</p>}
            {isError && <p>Error loading notes</p>}

            <NoteList
                notes={data?.notes ?? []}
                onDelete={(id) => deleteMutation.mutate(id)}
            />

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm
                        onCancel={() => setIsModalOpen(false)}
                        onSubmit={(values) => createMutation.mutate(values)}
                    />
                </Modal>
            )}
        </div>
    );
}
