"use client";

import { createContext, useContext, useState } from "react";
import { BOOKMARKS, COLLECTIONS } from "~/data/mockData";
import { Bookmark, Collection, FilterState } from "~/types";

interface AppContextType {
  // Data
  bookmarks: Bookmark[];
  collections: Collection[];
  // Filter state
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(BOOKMARKS);
  const [collections, setCollections] = useState<Collection[]>(COLLECTIONS);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFilters] = useState({
    collectionId: null,
    tag: null,
    search: "",
    showFavorites: false,
    showRecent: false
  });

  const ContextValue = {
    bookmarks,
    setBookmarks,
    collections,
    setCollections,
    sidebarOpen,
    setSidebarOpen,
    filters,
    setFilters
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
