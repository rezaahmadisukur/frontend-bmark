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
import { Button } from "~/components/ui/button";

const PAGE_SIZE = 12;

const MainContent = () => {
  const { filters } = useBookmarkFilters();
  const { viewMode, sortMode } = useApp();

  // Debounce search — baru kirim ke server setelah user berhenti mengetik 400ms
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  useEffect(() => {
    const to = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(to);
  }, [filters.search]);

  // Pagination: jumlah item yang dimuat (naik bertahap via "Load more")
  const [limit, setLimit] = useState(PAGE_SIZE);

  // Reset limit saat search/sort/filter berubah (biar mulai dari awal).
  // Dipakai pola "adjusting state during render" (bukan useEffect) — reset hanya
  // saat signature berubah, supaya tombol "Load more" tetap bekerja tanpa trigger
  // setState di dalam effect.
  const resetKey = [
    debouncedSearch,
    sortMode,
    filters.tag,
    filters.collectionId,
    filters.showFavorites,
    filters.showRecent
  ].join("|");
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    setLimit(PAGE_SIZE);
  }

  const {
    data,
    isLoading,
    error
  } = useGetBookmarks({
    input: {
      search: debouncedSearch || undefined,
      sort: sortMode,
      page: 1,
      limit
    }
  });

  // Normalisasi: backend bisa return array penuh (tanpa page) atau { data, meta } (paginated)
  const paginated = !Array.isArray(data);
  const bookmarks = Array.isArray(data) ? data : data?.data;
  const total = paginated
    ? (
        data as {
          meta?: { total: number };
        }
      )?.meta?.total ?? 0
    : bookmarks?.length ?? 0;
  const hasMore = (bookmarks?.length ?? 0) < total;

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

  // Filter client-side: tag, collection, favorites, recent (search sudah di server)
  const filteredBookmarks = bookmarks?.filter((b) => {
    if (filters.tag && !b.tags?.some((t: { tag: { name: string } }) => t.tag.name === filters.tag))
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

  // Sort sudah di server (backend orderBy). Tanpa transformation tambahan.
  const sortedBookmarks = filteredBookmarks;

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

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center px-5 pb-6">
          <Button
            variant="outline"
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
            className="cursor-pointer"
          >
            Load more
          </Button>
        </div>
      )}

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
