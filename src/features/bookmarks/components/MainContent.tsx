"use client";

import { useGetBookmarks } from "~/features/bookmarks/api/get-bookmarks";
import BookmarkCard from "./BookmarkCard";
import { Loader2 } from "lucide-react";

const MainContent = () => {
  const { data: bookmarks, isLoading, error } = useGetBookmarks();

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

  return (
    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
      {bookmarks?.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} viewMode="grid" />
      ))}
    </div>
  );
};

export default MainContent;
