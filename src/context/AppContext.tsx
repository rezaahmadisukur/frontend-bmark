"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState
} from "react";
import {
  FilterState,
  SortMode,
  ViewMode
} from "~/types/api";

interface AppContextType {
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
  // Filter state
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
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

  const ContextValue = useMemo(
    () => ({
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
      setCommandPaletteOpen
    }),
    [
      viewMode,
      sortMode,
      sidebarOpen,
      addModalOpen,
      filters,
      commandPaletteOpen
    ]
  );

  return (
    <AppContext.Provider value={ContextValue}>{children}</AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
