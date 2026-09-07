"use client";

import { Tag, X } from "lucide-react";
import { Activity } from "./Activity";
import { cn } from "~/lib/utils";
import { useBookmarkFilters } from "~/features/bookmarks/hooks/use-bookmark-filters";
import { useGetTags } from "~/features/tags/api/get-tags";
import { useGetBookmarks } from "~/features/bookmarks/api/get-bookmarks";

const TagFilter = () => {
  const { data: tags } = useGetTags();
  const { data } = useGetBookmarks();
  const bookmarks = Array.isArray(data) ? data : data?.data;
  const { filters, setFilters } = useBookmarkFilters();

  // Count bookmark per tag
  const tagCounts = (tags ?? []).reduce<Record<string, number>>((acc, tag) => {
    acc[tag.name] =
      bookmarks?.filter((b) => b.tags?.some((t: { tag: { name: string } }) => t.tag.name === tag.name))
        .length ?? 0;
    return acc;
  }, {});

  const handleTag = (tag: string) => {
    setFilters((f) => ({ ...f, tag: f.tag === tag ? null : tag }));
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto border-b border-border px-4 py-2.5 scrollbar-none">
      <div className="flex items-center shrink-0 gap-1.5 text-muted-foreground">
        <Tag size={12} />
        <span className="text-[11px] font-medium">Filter:</span>
      </div>

      <Activity mode={filters.tag ? "visible" : "hidden"}>
        <button
          onClick={() => setFilters((f) => ({ ...f, tag: null }))}
          className="flex items-center shrink-0 gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground cursor-pointer"
        >
          <X size={10} />
          Clear
        </button>
      </Activity>

      <div className="flex items-center gap-1.5">
        {tags === undefined ? (
          <>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-14 animate-pulse rounded-full bg-muted"
              />
            ))}
          </>
        ) : (
          tags.map((tag) => {
            const isActive = filters.tag === tag.name;
            const count = tagCounts[tag.name] ?? 0;
            return (
              <button
                key={tag.id}
                onClick={() => handleTag(tag.name)}
                className={cn(
                  "flex items-center shrink-0 gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary/30 text-primary/80 ring-1 ring-primary/50"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground/80"
                )}
              >
                <span>#{tag.name}</span>
                <span
                  className={cn(
                    "rounded px-1 text-[9px] tabular-nums",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TagFilter;
