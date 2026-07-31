"use client";

import { useGetBookmarks } from "~/features/bookmarks/api/get-bookmarks";
import BookmarkCard from "./BookmarkCard";
import DeleteBookmarkModal from "./DeleteBookmarkModal";
import { Loader2 } from "lucide-react";
import { useBookmarkFilters } from "../hooks/use-bookmark-filters";
import { useState } from "react";
import { Bookmark } from "~/types/api";

const MainContent = () => {
  const { data: bookmarks, isLoading, error } = useGetBookmarks();
  const { filters } = useBookmarkFilters();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState<Bookmark | null>(
    null
  );

  const handleDeleteClick = (bookmark: Bookmark) => {
    setBookmarkToDelete(bookmark);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setBookmarkToDelete(null);
  };

  const filteredBookmarks = bookmarks?.filter((b) => {
    if (
      filters.search &&
      !b.title.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
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

  if (!filteredBookmarks || filteredBookmarks.length === 0) {
    return (
      <div className="p-5 text-center text-muted-foreground">
        No bookmarks found. Try adjusting your filters
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredBookmarks?.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            viewMode="grid"
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </div>

      <DeleteBookmarkModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        bookmark={bookmarkToDelete}
      />
    </>
  );
};

export default MainContent;
