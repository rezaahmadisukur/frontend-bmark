"use client";

import { useGetBookmarks } from "~/features/bookmarks/api/get-bookmarks";
import BookmarkCard from "./BookmarkCard";
import DeleteBookmarkModal from "./DeleteBookmarkModal";
import EmptyState from "./EmptyState";
import { useBookmarkFilters } from "../hooks/use-bookmark-filters";
import { useEffect, useState } from "react";
import { Bookmark } from "~/types/api";
import EditBookmarkModal from "./EditBookmarkModal";
import { useApp } from "~/context/AppContext";
import { cn } from "~/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from "~/components/ui/pagination";

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

  // Pagination: halaman aktif (page-based, dari meta.totalPages)
  const [page, setPage] = useState(1);

  // Reset ke halaman 1 saat search/sort/filter berubah.
  // Dipakai pola "adjusting state during render" (bukan useEffect) — reset hanya
  // saat signature berubah, tanpa trigger setState di dalam effect.
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
    setPage(1);
  }

  const {
    data,
    isLoading,
    error
  } = useGetBookmarks({
    input: {
      search: debouncedSearch || undefined,
      sort: sortMode,
      page,
      limit: PAGE_SIZE,
      tag: filters.tag || undefined,
      collectionId: filters.collectionId || undefined,
      favorites: filters.showFavorites || undefined,
      recent: filters.showRecent || undefined
    }
  });

  // Normalisasi: backend bisa return array penuh (tanpa page) atau { data, meta } (paginated)
  const paginated = !Array.isArray(data);
  const bookmarks = Array.isArray(data) ? data : data?.data;
  const totalPages = paginated
    ? (
        data as {
          meta?: { totalPages: number };
        }
      )?.meta?.totalPages ?? 1
    : 1;

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

  // Filter (tag/collection/favorites/recent) & search & sort semua di-handle
  // server via query params — data yang diterima sudah final.
  const sortedBookmarks = bookmarks;

  // Halaman yang ditampilkan di pagination: window + ellipsis
  const pagesToShow: (number | "...")[] = (() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (
      let p = Math.max(2, page - 1);
      p <= Math.min(totalPages - 1, page + 1);
      p++
    ) {
      pages.push(p);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  })();

  const gridClass =
    viewMode === "list"
      ? "flex flex-col gap-3 p-5"
      : "grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3";

  if (isLoading && !bookmarks) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-4"
          >
            <div className="relative h-32 w-full overflow-hidden rounded-lg bg-muted">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-muted-foreground/15 to-transparent" />
            </div>
            <div className="relative mt-3 h-4 w-2/3 overflow-hidden rounded-md bg-muted">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-muted-foreground/15 to-transparent" />
            </div>
            <div className="relative mt-2 h-3 w-full overflow-hidden rounded-md bg-muted">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-muted-foreground/15 to-transparent" />
            </div>
            <div className="relative mt-2 h-3 w-5/6 overflow-hidden rounded-md bg-muted">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-muted-foreground/15 to-transparent" />
            </div>
          </div>
        ))}
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

      {/* Pagination (page numbers) */}
      {paginated && totalPages > 1 && (
        <Pagination className="pb-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={cn(
                  "cursor-pointer",
                  page === 1 && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>

            {pagesToShow.map((p, i) => (
              <PaginationItem key={`${p}-${i}`}>
                {p === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => setPage(p)}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={cn(
                  "cursor-pointer",
                  page === totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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
