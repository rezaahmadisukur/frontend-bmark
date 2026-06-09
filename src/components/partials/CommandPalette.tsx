"use client";

import {
  ArrowRight,
  Bookmark,
  Clock,
  Hash,
  Search,
  Star,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Activity, useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "~/context/AppContext";
import { ALL_TAGS } from "~/data/mockData";
import { cn } from "~/lib/utils";
import type { Bookmark as BookmarkType } from "~/types";

type ResultItem =
  | { type: "bookmark"; data: BookmarkType }
  | { type: "tag"; data: string }
  | { type: "action"; label: string; action: () => void };

const CommandPalette = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    bookmarks,
    setFilters,
    setAddModalOpen
  } = useApp();
  const [query, setQuery] = useState<string>("");
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Open with CMD + K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
        setQuery("");
        setSelectedIdx(0);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  const close = useCallback(() => {
    setCommandPaletteOpen(false);
    setQuery("");
    setSelectedIdx(0);
  }, [setCommandPaletteOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    if (commandPaletteOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [commandPaletteOpen, close]);

  // Compute result
  const results: ResultItem[] = (() => {
    const q = query.toLowerCase().trim();

    if (!q) {
      // Show recent bookmark
      return bookmarks
        .slice(0, 5)
        .map((b) => ({ type: "bookmark" as const, data: b }));
    }

    const matchedBookmarks: ResultItem[] = bookmarks
      .filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.includes(q)) ||
          b.url.includes(q)
      )
      .slice(0, 5)
      .map((b) => ({ type: "bookmark" as const, data: b }));

    const matchedTags: ResultItem[] = ALL_TAGS.filter((t) => t.includes(q))
      .slice(0, 3)
      .map((t) => ({ type: "tag" as const, data: t }));

    return [...matchedBookmarks, ...matchedTags];
  })();

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!commandPaletteOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const item = results[selectedIdx];
        if (!item) return;
        if (item.type === "bookmark") {
          window.open(item.data.url, "_blank");
          close();
        } else if (item.type === "tag") {
          setFilters((f) => ({ ...f, tag: item.data }));
          close();
        } else if (item.type === "action") {
          item.action();
          close();
        }
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [commandPaletteOpen, close, results, selectedIdx, setFilters]);

  if (!commandPaletteOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) close();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Palette */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-900 shadow-2xl shadow-black/60">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-zinc-800/80 px-4 py-3.5">
          <Search size={16} className="shrink-0 text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            placeholder="Search bookmarks, tags..."
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 outline-none"
          />
          <Activity mode={query ? "visible" : "hidden"}>
            <button
              onClick={() => setQuery("")}
              className="w-6 h-6 flex items-center justify-center rounded text-zinc-600 hover:text-zinc-400"
            >
              <X size={12} />
            </button>
          </Activity>
          <kbd className="rounded-md border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
            ESC
          </kbd>
        </div>

        {/* Result */}
        <div className="max-h-80 overflow-y-auto">
          <Activity mode={!query ? "visible" : "hidden"}>
            <div className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
              <Clock size={10} />
              Recent Bookmarks
            </div>
          </Activity>

          <Activity mode={results.length === 0 ? "visible" : "hidden"}>
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Search size={24} className="text-zinc-700" />
              <p className="text-sm font-medium text-zinc-500">No Result</p>
              <p className="text-xs text-zinc-700">
                Try a different search term
              </p>
            </div>
          </Activity>

          <div className="p-1.5">
            {results.map((item, idx) => {
              const isSelected = idx === selectedIdx;

              if (item.type === "bookmark") {
                const b = item.data;

                return (
                  <Link
                    key={b.id}
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                      isSelected ? "bg-zinc-800" : "hover:bg-zinc-800/60"
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                      {b.favicon ? (
                        <Image
                          src={b.favicon}
                          width={16}
                          height={16}
                          alt=""
                          className="h-4 w-4 rounded-sm object-contain"
                        />
                      ) : (
                        <Bookmark size={12} className="text-zinc-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 truncate text-xs font-semibold text-zinc-200">
                        {b.title}
                        {b.isFavorite && (
                          <Star
                            size={10}
                            className="fill-amber-400 text-amber-400"
                          />
                        )}
                      </p>
                      <p className="truncate text-[11px] text-zinc-600">
                        {(() => {
                          try {
                            return new URL(b.url).hostname;
                          } catch {
                            return b.url;
                          }
                        })()}
                      </p>
                    </div>
                    <ArrowRight
                      size={12}
                      className={cn(
                        "shrink-0 text-zinc-700 transition-opacity",
                        isSelected ? "opacity-100 text-indigo-400" : "opacity-0"
                      )}
                    />
                  </Link>
                );
              }

              if (item.type === "tag") {
                return (
                  <button
                    key={`tag-${item.data}`}
                    onClick={() => {
                      setFilters((f) => ({ ...f, tag: item.data }));
                      close();
                    }}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                      isSelected ? "bg-zinc-800" : "hover:bg-zinc-800/60"
                    )}
                  >
                    <div className="w-8 h-8 shrink-0  flex justify-center items-center rounded-lg bg-violet-500/20">
                      <Hash size={12} className="text-violet-400" />
                    </div>

                    <div className="flex-1 text-left">
                      <p className="text-xs font-semibold text-zinc-200">
                        #{item.data}
                      </p>
                      <p className="text-[11px] text-zinc-600">Filter by tag</p>
                    </div>

                    <ArrowRight
                      size={12}
                      className={cn(
                        "shrink-0 transition-opacity",
                        isSelected
                          ? "opacity-100 text-indigo-400"
                          : "opacity-0 text-zinc-700"
                      )}
                    />
                  </button>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-zinc-800/80 px-4 py-2.5">
          <div className="flex items-center gap-1 text-[10px] text-zinc-700">
            <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5">
              ↑↓
            </kbd>
            Navigate
          </div>
          <div className="flex items-center gap-1 text-[10px] text-zinc-700">
            <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5">
              ↵
            </kbd>
            Open
          </div>
          <button
            onClick={() => {
              setAddModalOpen(true);
              close();
            }}
            className="ml-auto flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300"
          >
            <span>+ Add new</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
