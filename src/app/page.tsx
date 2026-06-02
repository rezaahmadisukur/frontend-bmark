import { PageHeader, Sidebar, TagFilter, Topbar } from "~/components/partials";

const BookmarkDashboard = () => {
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
          {/* Bookmark grid list */}
        </div>
      </div>
    </div>
  );
};

export default BookmarkDashboard;
