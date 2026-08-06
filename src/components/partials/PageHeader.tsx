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
import { useBookmarkFilters } from "~/features/bookmarks/hooks/use-bookmark-filters";
import { useGetBookmarks } from "~/features/bookmarks/api/get-bookmarks";
import { useGetCollections } from "~/features/collections/api/get-collections";

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
  const { filters } = useBookmarkFilters();
  const { data: bookmarks } = useGetBookmarks();
  const { data: collections } = useGetCollections();

  const getTitle = () => {
    if (filters.showFavorites)
      return {
        label: "Favorites",
        icon: <Star size={20} className="text-primary" />
      };

    if (filters.showRecent)
      return {
        label: "Recent",
        icon: <Clock size={20} className="text-primary" />
      };

    if (filters.collectionId) {
      const col = collections?.find((c) => c.id === filters.collectionId);

      if (col)
        return {
          label: col.name,
          icon: <CollectionIcon name={col.icon ?? "Layers"} color={col.color} />
        };
    }

    if (filters.tag)
      return {
        label: `#${filters.tag}`,
        icon: <Hash size={20} className="text-accent" />
      };

    return {
      label: "All Bookmarks",
      icon: <Bookmark size={20} className="text-primary" />
    };
  };

  const { label, icon } = getTitle();

  const totalCount = (() => {
    if (filters.showFavorites)
      return bookmarks?.filter((b) => b.isFavorite).length ?? 0;
    if (filters.showRecent) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return (
        bookmarks?.filter((b) => new Date(b.createdAt) >= weekAgo).length ?? 0
      );
    }
    if (filters.collectionId)
      return (
        bookmarks?.filter((b) => b.collectionId === filters.collectionId)
          .length ?? 0
      );

    return bookmarks?.length ?? 0;
  })();

  return (
    <div className="flex items-center gap-3 border-b border-border px-5 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
        {icon}
      </div>
      <div>
        <h1 className="text-base font-bold text-foreground">{label}</h1>
        <p className="text-xs text-muted-foreground">
          {totalCount} bookmark{totalCount !== 1 ? "s" : ""}
          {filters.search &&
            ` · ${totalCount} result${totalCount !== 1 ? "s" : ""}`}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
