import { Clock, FolderOpen, Plus, Search, Star } from "lucide-react";
import { useApp } from "~/context/AppContext";
import { useBookmarkFilters } from "~/features/bookmarks/hooks/use-bookmark-filters";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

interface EmptyStateProps {
  type: "all" | "search" | "favorites" | "recent" | "collection" | "tag";
}

const EmptyState = ({ type }: EmptyStateProps) => {
  const { setAddModalOpen } = useApp();
  const { setFilters } = useBookmarkFilters();

  const primary =
    "flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-95";
  const secondary =
    "flex items-center gap-2 rounded-xl border border-border bg-muted px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground";

  const configs = {
    all: {
      icon: <FolderOpen size={48} className="text-muted-foreground/60" />,
      title: "No bookmarks yet",
      subtitle:
        "Add your first bookmark and start building your developer library.",
      action: (
        <Button className={primary} onClick={() => setAddModalOpen(true)}>
          <Plus size={16} />
          Add First Bookmark
        </Button>
      )
    },
    search: {
      icon: <Search size={48} className="text-muted-foreground/60" />,
      title: "No results found",
      subtitle: "Try adjusting your search term or browse all bookmarks.",
      action: (
        <Button
          className={secondary}
          onClick={() => setFilters({ search: null, tag: null })}
        >
          Clear Search
        </Button>
      )
    },
    favorites: {
      icon: <Star size={48} className="text-muted-foreground/60" />,
      title: "No favorites yet",
      subtitle: "Star your most important bookmarks to see them here.",
      action: (
        <Button
          className={secondary}
          onClick={() => setFilters({ showFavorites: false })}
        >
          Browse All
        </Button>
      )
    },
    recent: {
      icon: <Clock size={48} className="text-muted-foreground/60" />,
      title: "No recent bookmarks",
      subtitle: "Bookmarks added in the last 7 days will appear here.",
      action: null
    },
    collection: {
      icon: <FolderOpen size={48} className="text-muted-foreground/60" />,
      title: "This collection is empty",
      subtitle: "Add a bookmark and assign it to this collection.",
      action: (
        <Button className={primary} onClick={() => setAddModalOpen(true)}>
          <Plus size={16} />
          Add Bookmark
        </Button>
      )
    },
    tag: {
      icon: <Search size={48} className="text-muted-foreground/60" />,
      title: "No bookmarks with this tag",
      subtitle: "Try another tag or browse all bookmarks.",
      action: (
        <Button className={secondary} onClick={() => setFilters({ tag: null })}>
          Clear Tag
        </Button>
      )
    }
  };

  const config = configs[type];

  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center px-6 py-24")}>
      <div className="flex max-w-sm flex-col items-center gap-6 text-center">
        {/* Illustration Area */}
        <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border border-border bg-muted/60">
          {config.icon}
        </div>
        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground">{config.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
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
