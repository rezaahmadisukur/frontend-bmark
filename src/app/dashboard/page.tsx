import {
  AddBookmarkModal,
  CommandPalette,
  PageHeader,
  Sidebar,
  TagFilter,
  Topbar
} from "~/components/partials";
import MainContent from "~/features/bookmarks/components/MainContent";

const Dashboard = () => {
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
      <AddBookmarkModal />
      <CommandPalette />
    </div>
  );
};

export default Dashboard;
