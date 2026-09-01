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
      limit: PAGE_SIZE
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
