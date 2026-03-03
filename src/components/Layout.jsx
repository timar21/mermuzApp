import Sidebar from "./Sidebar";

function Layout({ children, showSidebar = true }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {showSidebar && <Sidebar />}
      {children}
    </div>
  );
}

export default Layout;