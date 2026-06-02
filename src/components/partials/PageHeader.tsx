"use client";

import {
  Bookmark,
  Clock,
  Star,
  Monitor,
  Server,
  Container,
  Palette,
  GraduationCap,
  Layers,
  Hash,
  type LucideProps
} from "lucide-react";
import { useApp } from "~/context/AppContext";

type IconComponent = React.ComponentType<LucideProps>;

const ICON_MAP: Record<string, IconComponent> = {
  Monitor,
  Server,
  Container,
  Palette,
  GraduationCap,
  Layers
};

function CollectionIcon({ name, color }: { name: string; color: string }) {
  const Icon = ICON_MAP[name] ?? Layers;
  return <Icon size={20} style={{ color }} />;
}

const PageHeader = () => {
  const { filters, bookmarks, collections, filteredBookmarks } = useApp();

  const getTitle = () => {
    if (filters.showFavorites)
      return {
        label: "Favorites",
        icon: <Star size={20} className="text-amber-400" />
      };

    if (filters.showRecent)
      return {
        label: "Recent",
        icon: <Clock size={20} className="text-blue-400" />
      };

    if (filters.collectionId) {
      const col = collections.find((c) => c.id === filters.collectionId);

      if (col)
        return {
          label: col.name,
          icon: <CollectionIcon name={col.icon} color={col.color} />
        };
    }

    if (filters.tag)
      return {
        label: `#${filters.tag}`,
        icon: <Hash size={20} className="text-violet-400" />
      };

    return {
      label: "All Bookmarks",
      icon: <Bookmark size={20} className="text-indigo-400" />
    };
  };

  const { label, icon } = getTitle();

  const totalCount = (() => {
    if (filters.showFavorites)
      return bookmarks.filter((b) => b.isFavorite).length;
    if (filters.showRecent) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return bookmarks.filter((b) => b.createdAt >= weekAgo).length;
    }
    if (filters.collectionId)
      return bookmarks.filter((b) => b.collectionId === filters.collectionId)
        .length;

    return bookmarks.length;
  })();

  return (
    <div className="flex items-center gap-3 border-b border-zinc-800/60 px-5 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-800/80">
        {icon}
      </div>
      <div>
        <h1 className="text-base font-bold text-zinc-100">{label}</h1>
        <p className="text-xs text-zinc-600">
          {totalCount} bookmark{totalCount !== 1 ? "s" : ""}
          {filters.search &&
            ` · ${filteredBookmarks.length} result${filteredBookmarks.length !== 1 ? "s" : ""}`}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
