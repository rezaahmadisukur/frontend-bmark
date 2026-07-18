"use client";

import { Tag, X } from "lucide-react";
import { Activity } from "./Activity";
import { useApp } from "~/context/AppContext";
import { ALL_TAGS } from "~/data/mockData";
import { cn } from "~/lib/utils";

const TagFilter = () => {
  const { filters, setFilters, bookmarks } = useApp();

  // Count bookmark per tag
  const tagCounts = ALL_TAGS.reduce<Record<string, number>>((acc, tag) => {
    acc[tag] = bookmarks.filter((b) => b.tags.includes(tag)).length;
    return acc;
  }, {});

  const handleTag = (tag: string) => {
    setFilters((f) => ({ ...f, tag: f.tag === tag ? null : tag }));
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto border-b border-zinc-800/50 px-4 py-2.5 scrollbar-none">
      <div className="flex items-center shrink-0 gap-1.5 text-zinc-600">
        <Tag size={12} />
        <span className="text-[11px] font-medium">Filter:</span>
      </div>

      <Activity mode={filters.tag ? "visible" : "hidden"}>
        <button
          onClick={() => setFilters((f) => ({ ...f, tag: null }))}
          className="flex items-center shrink-0 gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200 cursor-pointer"
        >
          <X size={10} />
          Clear
        </button>
      </Activity>

      <div className="flex items-center gap-1.5">
        {ALL_TAGS.map((tag) => {
          const isActive = filters.tag === tag;
          const count = tagCounts[tag] ?? 0;
          return (
            <button
              key={tag}
              onClick={() => handleTag(tag)}
              className={cn(
                "flex items-center shrink-0 gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-150",
                isActive
                  ? "bg-indigo-600/30 text-indigo-300 ring-1 ring-indigo-500/50"
                  : "bg-zinc-800/80 text-zinc-500 hover:bg-zinc-700/80 hover:text-zinc-300"
              )}
            >
              <span>#{tag}</span>
              <span
                className={cn(
                  "rounded px-1 text-[9px] tabular-nums",
                  isActive
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "bg-zinc-700 text-zinc-600"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagFilter;
