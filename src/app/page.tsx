import { Sidebar, Topbar } from "~/components/partials";

const BookmarkDashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <Topbar />
      </div>
    </div>
  );
};

export default BookmarkDashboard;
