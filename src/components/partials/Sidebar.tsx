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
  ChevronRight,
  Plus,
  Layers,
  X
} from "lucide-react";
import { useApp } from "~/context/AppContext";
import { cn } from "~/lib/utils";
import { Collection } from "~/types/api";
import { useBookmarkFilters } from "~/features/bookmarks/hooks/use-bookmark-filters";
import { useGetBookmarks } from "~/features/bookmarks/api/get-bookmarks";
import { useGetCollections } from "~/features/collections/api/get-collections";

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Monitor,
  Server,
  Container,
  Palette,
  GraduationCap,
  Layers
};

function CollectionIcon({
  name,
  className
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] ?? Layers;
  return <Icon size={14} className={className} />;
}

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  count?: number;
  onClick: () => void;
}

function NavItem({ label, icon, active, count, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
        active
          ? "bg-sidebar-primary/60 text-sidebar-primary-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground hover:translate-x-0.5"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-sidebar-primary" />
      )}
      <span
        className={cn(
          "shrink-0",
          active
            ? "text-sidebar-primary"
            : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
        )}
      >
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "ml-auto rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
            active
              ? "bg-sidebar-primary/20 text-sidebar-primary-foreground"
              : "bg-sidebar-accent/80 text-sidebar-foreground/60"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function CollectionItem({ collection }: { collection: Collection }) {
  const { filters, setFilters } = useBookmarkFilters();
  const { data: bookmarks } = useGetBookmarks();
  const isActive = filters.collectionId === collection.id;
  const count =
    bookmarks?.filter((b) => b.collectionId === collection.id).length ?? 0;

  return (
    <button
      onClick={() =>
        setFilters({
          ...filters,
          collectionId: isActive ? "" : collection.id,
          showFavorites: false,
          showRecent: false,
          tag: ""
        })
      }
      className={cn(
        "group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
        isActive
          ? "bg-sidebar-primary/60 text-sidebar-primary-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground hover:translate-x-0.5"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-sidebar-primary" />
      )}
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
        style={{ color: collection.color }}
      >
        <CollectionIcon name={collection.icon ?? "Layers"} />
      </span>
      <span className="flex-1 truncate text-left">{collection.name}</span>
      <span
        className={cn(
          "ml-auto rounded-md px-1.5 py-0.5 text-xs tabular-nums",
          isActive
            ? "bg-sidebar-primary/20 text-sidebar-primary-foreground"
            : "bg-sidebar-accent/80 text-sidebar-foreground/60"
        )}
      >
        {count}
      </span>
      <ChevronRight
        size={12}
        className={cn(
          "shrink-0 transition-transform",
          isActive
            ? "rotate-90 text-sidebar-foreground/70"
            : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/50"
        )}
      />
    </button>
  );
}

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useApp();
  const { filters, setFilters } = useBookmarkFilters();
  const { data: bookmarks } = useGetBookmarks();
  const { data: collections } = useGetCollections();

  const allCount = bookmarks?.length ?? 0;
  const recentCount =
    bookmarks?.filter((b) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(b.createdAt) >= weekAgo;
    }).length ?? 0;
  const favCount = bookmarks?.filter((b) => b.isFavorite).length ?? 0;

  const resetFilters = (overrides: Partial<typeof filters>) => {
    setFilters({
      search: "",
      tag: "",
      collectionId: "",
      showFavorites: false,
      showRecent: false,
      ...overrides
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-sidebar-primary to-sidebar-accent shadow-lg shadow-sidebar-primary/50">
              <Bookmark size={14} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
                B-Mark
              </span>
              <p className="text-[10px] text-sidebar-foreground/60">
                Developer Bookmarks
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-6 w-6 items-center justify-center rounded text-sidebar-foreground/50 hover:text-sidebar-foreground lg:hidden"
          >
            <X size={14} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-3">
          {/* Main nav */}
          <div className="mb-1 space-y-1">
            <NavItem
              label="All Bookmarks"
              icon={<Bookmark size={14} />}
              active={
                !filters.showFavorites &&
                !filters.showRecent &&
                !filters.collectionId
              }
              count={allCount}
              onClick={() => resetFilters({})}
            />
            <NavItem
              label="Recent"
              icon={<Clock size={14} />}
              active={filters.showRecent}
              count={recentCount}
              onClick={() => resetFilters({ showRecent: true })}
            />
            <NavItem
              label="Favorites"
              icon={<Star size={14} />}
              active={filters.showFavorites}
              count={favCount}
              onClick={() => resetFilters({ showFavorites: true })}
            />
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-sidebar-border" />

          {/* Collections */}
          <div>
            <div className="mb-2 flex items-center justify-between px-3">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/60">
                Collections
              </span>
              <button className="flex h-5 w-5 items-center justify-center rounded text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
                <Plus size={12} />
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              {collections?.map((c) => (
                <CollectionItem key={c.id} collection={c} />
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-sidebar-primary to-sidebar-accent text-xs font-bold text-sidebar-primary-foreground">
              BM
            </div>
            <div>
              <p className="text-xs font-medium text-sidebar-foreground/80">
                Dev User
              </p>
              <p className="text-[10px] text-sidebar-foreground/50">
                example@bmark.app
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
