"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import { BOOKMARKS, COLLECTIONS } from "~/data/mockData";
import { Bookmark, Collection, FilterState, SortMode, ViewMode } from "~/types";

interface AppContextType {
  // Data
  bookmarks: Bookmark[];
  collections: Collection[];
  // Filter state
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  // View
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  // Modal
  addModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  // Actions
  addBookmark: (bookmark: Bookmark) => void;
  toggleFavorite: (id: string) => void;
  deleteBookmark: (id: string) => void;
  // Computed
  filteredBookmarks: Bookmark[];
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(BOOKMARKS);
  const [collections, setCollections] = useState<Collection[]>(COLLECTIONS);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({
    collectionId: null,
    tag: null,
    search: "",
    showFavorites: false,
    showRecent: false
  });

  const addBookmark = useCallback((bookmark: Bookmark) => {
    setBookmarks((prev) => [bookmark, ...prev]);
  }, []);

  const toggleFavorite = useCallback(
    (id: string) =>
      setBookmarks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b))
      ),
    []
  );

  const deleteBookmark = useCallback(
    (id: string) => setBookmarks((prev) => prev.filter((b) => b.id !== id)),
    []
  );

  // Computed filtered bookmarks
  const filteredBookmarks = useMemo(() => {
    let result = [...bookmarks];

    // Filter by search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q)) ||
          b.url.toLowerCase().includes(q)
      );
    }

    // Filter by favorites
    if (filters.showFavorites) {
      result = result.filter((b) => b.isFavorite);
    }

    // Filter by recent (last 7 days)
    if (filters.showRecent) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      result = result.filter((b) => b.createdAt >= weekAgo);
    }

    // Filter by collection
    if (filters.collectionId) {
      result = result.filter((b) => b.collectionId === filters.collectionId);
    }

    // Filter by tag
    if (filters.tag) {
      result = result.filter((b) => b.tags.includes(filters.tag!));
    }

    // Sort
    result.sort((a, b) => {
      if (sortMode === "newest")
        return b.createdAt.getTime() - a.createdAt.getTime();
      if (sortMode === "oldest")
        return a.createdAt.getTime() - b.createdAt.getTime();
      if (sortMode === "az") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [bookmarks, filters, sortMode]);

  const ContextValue = {
    bookmarks,
    setBookmarks,
    collections,
    setCollections,
    viewMode,
    setViewMode,
    sortMode,
    setSortMode,
    sidebarOpen,
    setSidebarOpen,
    addModalOpen,
    setAddModalOpen,
    filters,
    setFilters,
    commandPaletteOpen,
    setCommandPaletteOpen,
    filteredBookmarks,
    toggleFavorite,
    deleteBookmark,
    addBookmark
  };

  return (
    <AppContext.Provider value={ContextValue}>{children}</AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
