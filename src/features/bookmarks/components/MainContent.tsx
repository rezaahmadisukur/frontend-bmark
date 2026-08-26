"use client";

import { useGetBookmarks } from "~/features/bookmarks/api/get-bookmarks";
import BookmarkCard from "./BookmarkCard";
import DeleteBookmarkModal from "./DeleteBookmarkModal";
import EmptyState from "./EmptyState";
import { Loader2 } from "lucide-react";
import { useBookmarkFilters } from "../hooks/use-bookmark-filters";
import { useEffect, useState } from "react";
import { Bookmark } from "~/types/api";
import EditBookmarkModal from "./EditBookmarkModal";
import { useApp } from "~/context/AppContext";

const MainContent = () => {
  const { filters } = useBookmarkFilters();
  const { viewMode, sortMode } = useApp();

  // Debounce search — baru kirim ke server setelah user berhenti mengetik 400ms
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  useEffect(() => {
    const to = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(to);
  }, [filters.search]);

  const {
    data: bookmarks,
    isLoading,
    error
  } = useGetBookmarks({
    input: {
      search: debouncedSearch || undefined
    }
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState<Bookmark | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [bookmarkToEdit, setBookmarkToEdit] = useState<Bookmark | null>(null);

  const handleDeleteClick = (bookmark: Bookmark) => {
    setBookmarkToDelete(bookmark);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setBookmarkToDelete(null);
  };

  const handleEditClick = (bookmark: Bookmark) => {
    setBookmarkToEdit(bookmark);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setBookmarkToEdit(null);
  };

  const filteredBookmarks = bookmarks?.filter((b) => {
    // Search (client-side) dihapus — sekarang di-handle server via ?search=
    if (filters.tag && !b.tags?.some((t) => t.tag.name === filters.tag))
      return false;
    if (filters.collectionId && b.collectionId !== filters.collectionId)
      return false;
    if (filters.showFavorites && !b.isFavorite) return false;
    if (filters.showRecent) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (new Date(b.createdAt) < weekAgo) return false;
    }
    return true;
  });

  const sortedBookmarks = filteredBookmarks
    ? [...filteredBookmarks].sort((a, b) => {
        if (sortMode === "oldest")
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        if (sortMode === "az") return a.title.localeCompare(b.title);
        // default: newest
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
    : undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-center text-destructive">
        Gagal memuat bookmark. Silahkan coba lagi.
      </div>
    );
  }

  if (!sortedBookmarks || sortedBookmarks.length === 0) {
    const emptyType = filters.search
      ? "search"
      : filters.showFavorites
        ? "favorites"
        : filters.showRecent
          ? "recent"
          : filters.collectionId
            ? "collection"
            : filters.tag
              ? "tag"
              : "all";
    return (
      <div className="flex flex-1 items-center justify-center p-5">
        <EmptyState type={emptyType} />
      </div>
    );
  }

  return (
    <>
      <div
        className={
          viewMode === "list"
            ? "flex flex-col gap-3 p-5"
            : "grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3"
        }
      >
        {sortedBookmarks?.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            viewMode={viewMode}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </div>

      <EditBookmarkModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        bookmark={bookmarkToEdit}
      />

      <DeleteBookmarkModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        bookmark={bookmarkToDelete}
      />
    </>
  );
};

export default MainContent;
