"use client";

import {
  AlertCircle,
  CheckCircle2,
  Globe,
  Link2,
  Loader2,
  X
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "~/context/AppContext";
import { COLLECTIONS } from "~/data/mockData";
import { cn } from "~/lib/utils";
import { Bookmark } from "~/types";

const MOCK_METADATA: Record<string, Partial<Bookmark>> = {
  default: {
    title: "Amazing Developer Resource",
    description:
      "A fantastic resource for developers. Packed with guides, tutorials, and references to help you build better software faster.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    favicon: "",
    tags: ["developer", "learning"]
  }
};

async function fetchMockMetadata(url: string): Promise<Partial<Bookmark>> {
  // Simulate network delay (1.5s)
  await new Promise((r) => setTimeout(r, 1500));

  const domain = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  })();

  // Return domain-based mock data
  if (domain.includes("nextjs")) {
    return {
      title: "Next.js Documentation",
      description:
        "The React framework for the web. Build high-quality applications with the power of React components.",
      image: "https://nextjs.org/static/twitter-cards/home.jpg",
      favicon: "https://nextjs.org/favicon.ico",
      tags: ["nextjs", "react", "frontend"]
    };
  }
  if (domain.includes("github")) {
    return {
      title: "GitHub Repository",
      description:
        "Build and ship software on the world's largest development platform.",
      image:
        "https://github.githubassets.com/images/modules/site/social-cards/github-social.png",
      favicon: "https://github.com/favicon.ico",
      tags: ["git", "open-source"]
    };
  }
  if (domain.includes("react") || domain.includes("reactjs")) {
    return {
      title: "React – A JavaScript library for building user interfaces",
      description:
        "React makes it painless to create interactive UIs. Design simple views for each state in your application.",
      image: "https://reactjs.org/logo-og.png",
      favicon: "https://reactjs.org/favicon.ico",
      tags: ["react", "javascript", "frontend"]
    };
  }

  return {
    ...MOCK_METADATA.default,
    title: `${domain} — Developer Resource`,
    favicon: `https://${domain}/favicon.ico`
  };
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-zinc-700/60 bg-zinc-800/50 p-4">
      <div className="relative h-36 overflow-hidden rounded-lg bg-zinc-700/50">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-zinc-600/20 to-transparent" />
      </div>
      <div className="space-y-2.5">
        <div className="relative h-4 w-3/4 overflow-hidden rounded-md bg-zinc-700/50">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-zinc-600/20 to-transparent" />
        </div>
        <div className="relative h-3 overflow-hidden rounded-md bg-zinc-700/50">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-zinc-600/20 to-transparent" />
        </div>
        <div className="relative h-3 w-5/6 overflow-hidden rounded-md bg-zinc-700/50">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-zinc-600/20 to-transparent" />
        </div>
        <div className="flex gap-2 pt-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative h-5 w-16 overflow-hidden rounded-full bg-zinc-700/50"
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-zinc-600/20 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type FetchState = "idle" | "loading" | "success" | "error";

const AddBookmarkModal = () => {
  const { addModalOpen, setAddModalOpen, addBookmark, collections } = useApp();
  const [url, setUrl] = useState("");
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [metadata, setMetadata] = useState<Partial<Bookmark> | null>(null);
  const [selectedCollection, setSelectedCollection] = useState(
    COLLECTIONS[0]?.id ?? ""
  );
  const [customTags, setCustomTags] = useState("");
  const [tagInput, setTagInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleCloseModal = useCallback(() => {
    setUrl("");
    setFetchState("idle");
    setMetadata(null);
    setCustomTags("");
    setTagInput("");
    setAddModalOpen(false);
  }, [setAddModalOpen]);

  useEffect(() => {
    if (addModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [addModalOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleCloseModal();
    }
    if (addModalOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [addModalOpen, setAddModalOpen, handleCloseModal]);

  const handleFetch = async () => {
    if (!url.trim()) return;
    setFetchState("loading");
    setMetadata(null);
    try {
      const data = await fetchMockMetadata(url);
      setMetadata(data);
      setFetchState("success");
    } catch {
      setFetchState("error");
    }
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleFetch();
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
      if (
        tag &&
        !customTags
          .split(",")
          .map((t) => t.trim())
          .includes(tag)
      ) {
        setCustomTags((prev) => (prev ? `${prev}, ${tag}` : tag));
      }
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput) {
      const tags = customTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      tags.pop();
      setCustomTags(tags.join(", "));
    }
  };

  const handleSave = () => {
    if (!metadata) return;

    const extraTags = customTags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const allTags = Array.from(
      new Set([...(metadata.tags ?? []), ...extraTags])
    );

    const newBookmark: Bookmark = {
      id: `bm-${Date.now()}`,
      url: url.trim(),
      title: metadata.title ?? url,
      description: metadata.description ?? "",
      image: metadata.image ?? "",
      favicon: metadata.favicon ?? "",
      tags: allTags,
      collectionId: selectedCollection,
      createdAt: new Date(),
      isFavorite: false
    };

    addBookmark(newBookmark);
    handleCloseModal();
  };

  const parsedTags = customTags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!addModalOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleCloseModal();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-900 shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20">
              <Link2 size={14} className="text-indigo-400" />
            </div>
            <h2 className="text-sm font-semibold text-white">
              Add New Bookmark
            </h2>
          </div>
          <button
            onClick={handleCloseModal}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-5">
          {/* URL Input */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Paste a URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                />
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleUrlKeyDown}
                  placeholder="https://example.com/article"
                  className="w-full rounded-xl border border-zinc-700/60 bg-zinc-800/60 py-2.5 pl-9 pr-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <button
                onClick={handleFetch}
                disabled={!url.trim() || fetchState === "loading"}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-900/40 transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
              >
                {fetchState === "loading" ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  "Fetch"
                )}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-zinc-600">
              Press Enter or click Fetch to retrieve metadata
            </p>
          </div>

          {/* Loading skeleton */}
          {fetchState === "loading" && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs text-zinc-500">
                <Loader2 size={11} className="animate-spin text-indigo-400" />
                Fetching metadata from URL...
              </p>
              <LoadingSkeleton />
            </div>
          )}

          {/* Error state */}
          {fetchState === "error" && (
            <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <div>
                <p className="text-xs font-medium text-red-300">
                  Failed to fetch metadata
                </p>
                <p className="text-[11px] text-red-400/70">
                  Check the URL and try again.
                </p>
              </div>
            </div>
          )}

          {/* Success — metadata preview */}
          {fetchState === "success" && metadata && (
            <>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 size={13} />
                <span>Metadata retrieved successfully</span>
              </div>

              {/* Preview card */}
              <div className="overflow-hidden rounded-xl border border-zinc-700/60 bg-zinc-800/50">
                {metadata.image && (
                  <div className="relative h-36 bg-zinc-800">
                    <Image
                      width={144}
                      height={144}
                      src={metadata.image}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-900/70 via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-4">
                  <input
                    type="text"
                    value={metadata.title ?? ""}
                    onChange={(e) =>
                      setMetadata((m) =>
                        m ? { ...m, title: e.target.value } : m
                      )
                    }
                    className="mb-1 w-full rounded-lg border border-transparent bg-transparent text-sm font-semibold text-zinc-100 outline-none transition-colors focus:border-zinc-700 focus:bg-zinc-800/60 focus:px-2"
                  />
                  <textarea
                    value={metadata.description ?? ""}
                    onChange={(e) =>
                      setMetadata((m) =>
                        m ? { ...m, description: e.target.value } : m
                      )
                    }
                    rows={2}
                    className="w-full resize-none rounded-lg border border-transparent bg-transparent text-xs text-zinc-500 outline-none transition-colors focus:border-zinc-700 focus:bg-zinc-800/60 focus:px-2"
                  />
                </div>
              </div>

              {/* Collection picker */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Collection
                </label>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700/60 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                >
                  {collections.map((c) => (
                    <option key={c.id} value={c.id} className="bg-zinc-800">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Tags
                </label>
                <div className="flex flex-wrap gap-1.5 rounded-xl border border-zinc-700/60 bg-zinc-800/60 p-2.5">
                  {/* Suggested tags from metadata */}
                  {metadata.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[11px] font-medium text-indigo-300"
                    >
                      #{tag}
                    </span>
                  ))}
                  {/* Custom tags */}
                  {parsedTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 rounded-md bg-violet-500/20 px-2 py-0.5 text-[11px] font-medium text-violet-300"
                    >
                      #{tag}
                      <button
                        onClick={() => {
                          const updated = parsedTags.filter((t) => t !== tag);
                          setCustomTags(updated.join(", "));
                        }}
                        className="text-violet-400 hover:text-violet-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add tag, press Enter"
                    className="min-w-24 flex-1 bg-transparent text-xs text-zinc-400 placeholder-zinc-600 outline-none"
                  />
                </div>
                <p className="mt-1 text-[11px] text-zinc-700">
                  Type a tag and press Enter or comma to add
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-zinc-800/80 px-5 py-4">
          <button
            onClick={handleCloseModal}
            className="rounded-xl border border-zinc-700/60 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 transition-all hover:bg-zinc-700 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={fetchState !== "success" || !metadata}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all active:scale-95",
              fetchState === "success" && metadata
                ? "bg-indigo-600 shadow-indigo-900/40 hover:bg-indigo-500"
                : "cursor-not-allowed bg-zinc-700 text-zinc-500 shadow-none"
            )}
          >
            Save Bookmark
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBookmarkModal;
