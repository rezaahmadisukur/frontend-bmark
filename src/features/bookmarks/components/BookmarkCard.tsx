"use client";

import {
  Check,
  Copy,
  ExternalLink,
  Globe,
  MoreHorizontal,
  Star,
  Trash2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { Activity } from "../../../components/partials/Activity";
import { cn } from "~/lib/utils";
import { Bookmark } from "~/types/api";
import { useUpdateBookmark } from "../api/update-bookmark";
import { useDeleteBookmark } from "../api/delete-bookmark";
import { useApp } from "~/context/AppContext";
import { useBookmarkFilters } from "../hooks/use-bookmark-filters";

interface BookmarkCardProps {
  bookmark: Bookmark;
  viewMode: "grid" | "list";
}

function TagPill({ tag }: { tag: string }) {
  const { setFilters } = useBookmarkFilters();
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setFilters((f) => ({ ...f, tag }));
      }}
      className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary"
    >
      #{tag}
    </button>
  );
}

function FaviconImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState<boolean>(false);
  if (error) {
    return (
      <div className="w-5 h-5 flex items-center justify-center rounded-sm bg-muted">
        <Globe size={11} className="text-muted-foreground" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={20}
      height={20}
      className="h-5 w-5 rounded-sm object-contain"
      onError={() => setError(true)}
    />
  );
}

function OGImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-card">
        <Globe size={32} className="text-muted-foreground/70" />
      </div>
    );
  }

  return (
    <>
      <Activity mode={!loaded ? "visible" : "hidden"}>
        <div className="absolute inset-0 animate-pulse bg-linear-to-r from-muted via-muted to-muted" />
      </Activity>

      <Image
        width={100}
        height={100}
        src={src}
        alt={alt}
        unoptimized
        className={cn(
          "h-full w-full object-cover transition-all duration-500",
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        )}
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

const BookmarkCard = ({ bookmark, viewMode }: BookmarkCardProps) => {
  const updateBookmark = useUpdateBookmark();
  const deleteBookmark = useDeleteBookmark();
  const [copied, setCopied] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [timeAgo, setTimeAgo] = useState("");

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(bookmark.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateBookmark.mutate({
      id: bookmark.id,
      data: {
        isFavorite: !bookmark.isFavorite
      }
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (deleteConfirm) {
      deleteBookmark.mutate({
        id: bookmark.id
      });
    } else {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
    }
  };

  const domain = (() => {
    try {
      return new URL(bookmark.url).hostname.replace("www.", "");
    } catch {
      return bookmark.url;
    }
  })();

  useEffect(() => {
    const update = () => {
      const diff = Date.now() - new Date(bookmark.createdAt).getTime();
      const days = Math.floor(diff / 86400000);
      if (days === 0) setTimeAgo("Today");
      else if (days === 1) setTimeAgo("Yesterday");
      else if (days < 7) setTimeAgo(`${days}d ago`);
      else if (days < 30) setTimeAgo(`${Math.floor(days / 7)}w ago`);
      else setTimeAgo(`${Math.floor(days / 30)}mo ago`);
    };

    update();
    const interval = setInterval(update, 60_000); // update setiap menit
    return () => clearInterval(interval);
  }, [bookmark.createdAt]);

  // Grid View
  return (
    <Fragment>
      <Activity mode={viewMode === "list" ? "visible" : "hidden"}>
        <div className="group relative flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/50 hover:bg-muted/60 hover:shadow-lg hover:shadow-black/20">
          {/* Favicon */}
          <div className="shrink-0">
            <FaviconImage src={bookmark.favicon || ""} alt={bookmark.title} />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-sm font-semibold text-card-foreground transition-colors hover:text-primary"
              >
                {bookmark.title}
              </Link>
              {bookmark.isFavorite && (
                <Star
                  size={11}
                  className="shrink-0 fill-amber-400 text-amber-400"
                />
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {bookmark.description}
            </p>
          </div>

          {/* Tags - hidden on mobile */}
          <div className="hidden shrink-0 items-center gap-1 lg:flex">
            {bookmark.tags?.slice(0, 2).map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>

          {/* Domain + time */}
          <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
            <span className="text-[10px] text-muted-foreground">{domain}</span>
            <span className="text-[10px] text-muted-foreground/70">
              {timeAgo}
            </span>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleCopy}
              title="Copy link"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {copied ? (
                <Check size={12} className="text-primary" />
              ) : (
                <Copy size={12} />
              )}
            </button>
            <Link
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ExternalLink size={12} />
            </Link>
            <button
              onClick={handleFavorite}
              title={bookmark.isFavorite ? "Unfavorite" : "Favorite"}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-accent",
                bookmark.isFavorite
                  ? "text-amber-400"
                  : "text-muted-foreground hover:text-amber-400"
              )}
            >
              <Star
                size={12}
                className={bookmark.isFavorite ? "fill-amber-400" : ""}
              />
            </button>
            <button
              onClick={handleDelete}
              title={deleteConfirm ? "Click again to confirm" : "Delete"}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-accent",
                deleteConfirm
                  ? "text-destructive"
                  : "text-muted-foreground hover:text-destructive"
              )}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </Activity>

      <Activity mode={viewMode === "grid" ? "visible" : "hidden"}>
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-2xl hover:shadow-black/40">
          {/* OG Image */}
          <div className="relative h-40 overflow-hidden bg-muted">
            <OGImage src={bookmark.image || ""} alt={bookmark.title} />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-card/80 via-transparent to-transparent" />

            {/* Top actions overlay */}
            <div className="absolute right-2 top-2 flex items-center gap-1.5 opacity-0 transition-all duration-200 group-hover:opacity-100">
              <button
                onClick={handleCopy}
                title="Copy link"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/90 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {copied ? (
                  <Check size={12} className="text-primary" />
                ) : (
                  <Copy size={12} />
                )}
              </button>
              <Link
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/90 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ExternalLink size={12} />
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((o) => !o);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/90 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <MoreHorizontal size={12} />
              </button>
            </div>

            {/* Dropdown menu */}
            {menuOpen && (
              <div
                className="absolute right-2 top-10 z-50 min-w-35 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl shadow-black/50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-1">
                  <button
                    onClick={(e) => {
                      handleFavorite(e);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-popover-foreground hover:bg-accent"
                  >
                    <Star
                      size={12}
                      className={
                        bookmark.isFavorite
                          ? "fill-amber-400 text-amber-400"
                          : ""
                      }
                    />
                    {bookmark.isFavorite ? "Unfavorite" : "Add to Favorites"}
                  </button>
                  <button
                    onClick={(e) => {
                      handleDelete(e);
                      setMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-accent",
                      deleteConfirm
                        ? "text-destructive"
                        : "text-popover-foreground"
                    )}
                  >
                    <Trash2 size={12} />
                    {deleteConfirm ? "Confirm Delete" : "Delete"}
                  </button>
                </div>
              </div>
            )}

            {/* Favorite badge */}
            {bookmark.isFavorite && (
              <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 backdrop-blur-sm">
                <Star size={10} className="fill-amber-400 text-amber-400" />
                <span className="text-[10px] font-medium text-amber-300">
                  Favorite
                </span>
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="flex flex-1 flex-col p-4">
            {/* Domain row */}
            <div className="mb-2.5 flex items-center gap-2">
              <FaviconImage src={bookmark.favicon || ""} alt={bookmark.title} />
              <span className="truncate text-[11px] text-muted-foreground">
                {domain}
              </span>
              <span className="ml-auto shrink-0 text-[10px] text-muted-foreground/70">
                {timeAgo}
              </span>
            </div>

            {/* Title */}
            <Link
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug text-card-foreground transition-colors hover:text-primary"
            >
              {bookmark.title}
            </Link>

            {/* Description */}
            <p className="mb-3 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
              {bookmark.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {bookmark.tags?.slice(0, 4).map((tag) => (
                <TagPill key={tag} tag={tag} />
              ))}
              {bookmark.tags?.length > 4 && (
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                  +{(bookmark.tags?.length ?? 0) - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </Activity>
    </Fragment>
  );
};

export default BookmarkCard;
