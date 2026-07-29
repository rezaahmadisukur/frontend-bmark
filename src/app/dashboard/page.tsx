"use client";

import { useState } from "react";
import {
  CommandPalette,
  PageHeader,
  Sidebar,
  TagFilter,
  Topbar
} from "~/components/partials";
import { useApp } from "~/context/AppContext";
import AddBookmarkModal from "~/features/bookmarks/components/AddBookmarkModal";
import MainContent from "~/features/bookmarks/components/MainContent";

const Dashboard = () => {
  const { addModalOpen, setAddModalOpen } = useApp();
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <Topbar />

        {/* Content Area */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Page header */}
          <PageHeader />
          {/* Tag filter bar */}
          <TagFilter />
          {/* Bookmark grid/list */}
          <MainContent />
        </div>
      </div>

      {/* Modals & Overlays */}
      <AddBookmarkModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
      <CommandPalette />
    </div>
  );
};

export default Dashboard;
