import { Clock, FolderOpen, Plus, Search, Star } from "lucide-react";
import Image from "next/image";
import { useApp } from "~/context/AppContext";

interface EmptyStateProps {
  type: "all" | "search" | "favorites" | "recent" | "collection" | "tag";
}

const EmptyState = ({ type }: EmptyStateProps) => {
  const { setAddModalOpen, setFilters } = useApp();

  const configs = {
    all: {
      icon: <FolderOpen size={48} className="text-zinc-700" />,
      title: "No bookmarks yet",
      subtitle:
        "Add your first bookmark and start building your developer library.",
      action: (
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition-all hover:bg-indigo-500 active:scale-95"
        >
          <Plus size={16} />
          Add First Bookmark
        </button>
      )
    },
    search: {
      icon: <Search size={48} className="text-zinc-700" />,
      title: "No results found",
      subtitle: "Try adjusting your search term or browse all bookmarks.",
      action: (
        <button
          onClick={() => setFilters((f) => ({ ...f, search: "", tag: null }))}
          className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-700 hover:text-white"
        >
          Clear Search
        </button>
      )
    },
    favorites: {
      icon: <Star size={48} className="text-zinc-700" />,
      title: "No favorites yet",
      subtitle: "Star your most important bookmarks to see them here.",
      action: (
        <button
          onClick={() => setFilters((f) => ({ ...f, showFavorites: false }))}
          className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-700 hover:text-white"
        >
          Browse All
        </button>
      )
    },
    recent: {
      icon: <Clock size={48} className="text-zinc-700" />,
      title: "No recent bookmarks",
      subtitle: "Bookmarks added in the last 7 days will appear here.",
      action: null
    },
    collection: {
      icon: <FolderOpen size={48} className="text-zinc-700" />,
      title: "This collection is empty",
      subtitle: "Add a bookmark and assign it to this collection.",
      action: (
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition-all hover:bg-indigo-500 active:scale-95"
        >
          <Plus size={16} />
          Add Bookmark
        </button>
      )
    },
    tag: {
      icon: <Search size={48} className="text-zinc-700" />,
      title: "No bookmarks with this tag",
      subtitle: "Try another tag or browse all bookmarks.",
      action: (
        <button
          onClick={() => setFilters((f) => ({ ...f, tag: null }))}
          className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-700 hover:text-white"
        >
          Clear Tag
        </button>
      )
    }
  };

  const config = configs[type];

  return (
    <div className="flex flex-1 flex-col justify-center items-center px-6 py-24">
      <div className="max-w-sm flex flex-col items-center text-center gap-6">
        {/* Illustrartion Area */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="relative w-32 h-32 flex justify-center items-center overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
            <Image
              width={128}
              height={128}
              src={"/assets/empty-state.png"}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <div className="relative">{config.icon}</div>
          </div>
        </div>
        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-zinc-200">{config.title}</h3>
          <p className="text-sm leading-relaxed text-zinc-500">
            {config.subtitle}
          </p>
        </div>
        {/* Action */}
        {config.action}
      </div>
    </div>
  );
};

export default EmptyState;
