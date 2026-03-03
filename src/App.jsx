import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
// import uses lowercase filename since the actual file is login.jsx
import Login from "./pages/login";
import Library from "./pages/mylab";
import Liked from "./pages/liked";
import NowPlaying from "./pages/NowPlaying";
import PlaylistPage from "./pages/Playlist";
import { LikedProvider } from "./contexts/LikedContext";
import { LibraryProvider } from "./contexts/LibraryContext";
import { PlaylistProvider } from "./contexts/PlaylistContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// small wrapper for protecting routes that require login
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    // send the user to /login but keep track of where they were going
    return (
      <Navigate to="/login" replace state={{ from: location }} />
    );
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <PlaylistProvider>
          <LikedProvider>
            <Router>
          <Routes>
            {/* regular pages with sidebar */}
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />

            {/* private sections require login */}
            <Route
              path="/mylab"
              element={
                <RequireAuth>
                  <Layout>
                    <Library />
                  </Layout>
                </RequireAuth>
              }
            />
            <Route
              path="/liked"
              element={
                <RequireAuth>
                  <Layout>
                    <Liked />
                  </Layout>
                </RequireAuth>
              }
            />

            {/* playlist detail view */}
            <Route
              path="/mylab/playlist/:playlistId"
              element={
                <RequireAuth>
                  <Layout>
                    <PlaylistPage />
                  </Layout>
                </RequireAuth>
              }
            />

            {/* now playing page without sidebar, also private */}
            <Route
              path="/now-playing"
              element={
                <RequireAuth>
                  <Layout showSidebar={false}>
                    <NowPlaying />
                  </Layout>
                </RequireAuth>
              }
            />
            {/* auth route should live inside <Routes> and doesn't use the sidebar */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </LikedProvider>
      </PlaylistProvider>
    </LibraryProvider>
    </AuthProvider>
  );
}

export default App;