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
import { Collection } from "~/types";

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
        "group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
        active
          ? "bg-zinc-700/60 text-white"
          : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100"
      )}
    >
      <span
        className={cn(
          "shrink-0",
          active ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
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
              ? "bg-indigo-500/20 text-indigo-300"
              : "bg-zinc-700/80 text-zinc-500"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function CollectionItem({ collection }: { collection: Collection }) {
  const { filters, setFilters, bookmarks } = useApp();
  const isActive = filters.collectionId === collection.id;
  const count = bookmarks.filter(
    (b) => b.collectionId === collection.id
  ).length;

  return (
    <button
      onClick={() =>
        setFilters((f) => ({
          ...f,
          collectionId: isActive ? null : collection.id,
          showFavorites: false,
          showRecent: false,
          tag: null
        }))
      }
      className={cn(
        "group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150",
        isActive
          ? "bg-zinc-700/60 text-white"
          : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100"
      )}
    >
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
        style={{ color: collection.color }}
      >
        <CollectionIcon name={collection.icon} />
      </span>
      <span className="flex-1 truncate text-left">{collection.name}</span>
      <span
        className={cn(
          "ml-auto rounded-md px-1.5 py-0.5 text-xs tabular-nums",
          isActive
            ? "bg-indigo-500/20 text-indigo-300"
            : "bg-zinc-700/80 text-zinc-500"
        )}
      >
        {count}
      </span>
      <ChevronRight
        size={12}
        className={cn(
          "shrink-0 transition-transform",
          isActive
            ? "rotate-90 text-zinc-400"
            : "text-zinc-600 group-hover:text-zinc-500"
        )}
      />
    </button>
  );
}

const Sidebar = () => {
  const {
    filters,
    setFilters,
    bookmarks,
    collections,
    sidebarOpen,
    setSidebarOpen
  } = useApp();

  const allCount = bookmarks.length;
  const recentCount = bookmarks.filter((b) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return b.createdAt >= weekAgo;
  }).length;
  const favCount = bookmarks.filter((b) => b.isFavorite).length;

  const resetFilters = (overrides: Partial<typeof filters>) => {
    setFilters({
      collectionId: null,
      tag: null,
      search: "",
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
          "fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-zinc-800/80 bg-zinc-900 transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/50">
              <Bookmark size={14} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white">
                DevMark
              </span>
              <p className="text-[10px] text-zinc-500">Developer Bookmarks</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 hover:text-zinc-300 lg:hidden"
          >
            <X size={14} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {/* Main nav */}
          <div className="mb-1">
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
          <div className="my-2 border-t border-zinc-800/80" />

          {/* Collections */}
          <div>
            <div className="mb-2 flex items-center justify-between px-3">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
                Collections
              </span>
              <button className="flex h-5 w-5 items-center justify-center rounded text-zinc-600 hover:bg-zinc-800 hover:text-zinc-400 transition-colors">
                <Plus size={12} />
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              {collections.map((c) => (
                <CollectionItem key={c.id} collection={c} />
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-zinc-800/80 p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
              D
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-300">Dev User</p>
              <p className="text-[10px] text-zinc-600">dev@devmark.app</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
