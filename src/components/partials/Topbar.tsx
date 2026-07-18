"use client";

import {
  ChevronDown,
  Command,
  LayoutGrid,
  List,
  Menu,
  Plus,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "~/context/AppContext";
import { cn } from "~/lib/utils";
import { SortMode } from "~/types";
import { Activity } from "./Activity";

const SORT_OPTIONS: { label: string; value: SortMode }[] = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "A → Z", value: "az" }
];

function SortDropdown() {
  const { sortMode, setSortMode } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentLabel =
    SORT_OPTIONS.find((option) => option.value === sortMode)?.label ?? "Sort";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/60 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700/60 hover:text-white"
      >
        <SlidersHorizontal size={12} />
        <span className="hidden sm:inline">{currentLabel}</span>
        <ChevronDown
          size={12}
          className={cn("transition-transform", { "rotate-180": open })}
        />
      </button>

      <Activity mode={open ? "visible" : "hidden"}>
        <div className="absolute right-0 top-full z-50 mt-1.5 w-40 overflow-hidden rounded-xl border border-zinc-700/60 bg-zinc-800 shadow-2xl shadow-black/50">
          <div className="bg-zinc-800 p-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setSortMode(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  sortMode === opt.value
                    ? "bg-indigo-600/30 text-indigo-300"
                    : "text-zinc-400 hover:bg-zinc-700/60 hover:text-white"
                )}
              >
                {sortMode === opt.value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
                {sortMode !== opt.value && <span className="w-1.5 h-1.5" />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </Activity>
    </div>
  );
}

const Topbar = () => {
  const {
    setSidebarOpen,
    setCommandPaletteOpen,
    filters,
    setFilters,
    setAddModalOpen,
    viewMode,
    setViewMode,
    filteredBookmarks
  } = useApp();
  return (
    <header className="sticky top-0 z-10 flex flex-col border-b border-zinc-800/80 bg-zinc-900/95 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Mobile menu */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-8 h-8 flex justify-center items-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden cursor-pointer"
        >
          <Menu size={16} />
        </button>

        {/* Search bar */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="group flex flex-1 items-center gap-2.5 rounded-xl border border-zinc-700/60 bg-zinc-800/50 px-3.5 py-2 text-sm text-zinc-500 transition-all hover:border-zinc-600/60 hover:bg-zinc-800/80 hover:text-zinc-400"
        >
          <Search size={14} className="shrink-0" />
          <span className="flex-1 text-left text-sm">
            {filters.search || "Search bookmarks..."}
          </span>
          <div className="flex items-center gap-0.5 rounded-md border border-zinc-700/60 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600">
            <Command size={10} />
            <span>K</span>
          </div>
        </button>

        {/* View toggle */}
        <div className="hidden items-center rounded-lg border border-zinc-700/60 bg-zinc-800/60 p-1 sm:flex">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "rounded-md p-1.5 transition-colors",
              viewMode === "grid"
                ? "bg-zinc-700 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "rounded-md p-1.5 transition-colors",
              viewMode === "list"
                ? "bg-zinc-700 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <List size={14} />
          </button>
        </div>

        {/* Sort */}
        <SortDropdown />

        {/* Add button */}
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-900/40 transition-all hover:bg-indigo-500 active:scale-95 cursor-pointer"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Add new</span>
        </button>
      </div>

      {/* Result count */}
      <div className="flex flex-wrap items-center gap-2 border-t border-zinc-800/50 px-4 py-2">
        <span className="text-xs text-zinc-600">
          {filteredBookmarks.length} bookmark
          {filteredBookmarks.length !== 1 ? "s" : ""}
        </span>
        <Activity mode={filters.search ? "visible" : "hidden"}>
          <span className="flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
            Search: &quot;{filters.search}&quot;
            <button
              onClick={() => setFilters((f) => ({ ...f, search: "" }))}
              className="ml-1 text-indigo-500 hover:text-indigo-300"
            >
              ×
            </button>
          </span>
        </Activity>
        <Activity mode={filters.tag ? "visible" : "hidden"}>
          <span className="flex items-center gap-1 rounded-md bg-violet-500/10 px-2 py-0.5 text-xs text-violet-400">
            #{filters.tag}
            <button
              onClick={() => setFilters((f) => ({ ...f, tag: null }))}
              className="ml-1 text-violet-500 hover:text-violet-300"
            >
              ×
            </button>
          </span>
        </Activity>
      </div>
    </header>
  );
};

export default Topbar;
