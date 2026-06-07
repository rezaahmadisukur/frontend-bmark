"use client";

import { useEffect, useRef } from "react";
import { useApp } from "~/context/AppContext";
import EmptyState from "./EmptyState";
import { cn } from "~/lib/utils";
import BookmarkCard from "./BookmarkCard";

function getEmtpyStateType(
  filters: ReturnType<typeof useApp>["filters"],
  bookmarksEmpty: boolean
): "all" | "search" | "collection" | "favorites" | "recent" | "tag" {
  if (
    bookmarksEmpty &&
    !filters.collectionId &&
    !filters.search &&
    !filters.showFavorites &&
    !filters.showRecent &&
    !filters.tag
  ) {
    return "all";
  }
  if (filters.search) return "search";
  if (filters.collectionId) return "collection";
  if (filters.showFavorites) return "favorites";
  if (filters.showRecent) return "recent";
  if (filters.tag) return "tag";
  return "all";
}

const MainContent = () => {
  const { filteredBookmarks, viewMode, filters, bookmarks } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when filters change
  useEffect(() => {
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, [
    filters.collectionId,
    filters.showFavorites,
    filters.showRecent,
    filters.tag
  ]);

  // const isEmpty = true;
  const isEmpty = filteredBookmarks.length === 0;
  const emptyType = getEmtpyStateType(filters, bookmarks.length === 0);

  if (isEmpty) {
    return <EmptyState type={emptyType} />;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "p-5",
        viewMode === "grid"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          : "flex flex-col gap-2"
      )}
    >
      {filteredBookmarks.map((bookmark, index) => (
        <div key={bookmark.id}>
          <BookmarkCard bookmark={bookmark} viewMode={viewMode} />
        </div>
      ))}
    </div>
  );
};

export default MainContent;
