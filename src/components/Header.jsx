import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, currentUser } = useAuth();

  const [search, setSearch] = useState('');

  // sync input with search query on home only
  useEffect(() => {
    if (location.pathname === '/') {
      const params = new URLSearchParams(location.search);
      setSearch(params.get('search') || '');
    } else {
      setSearch('');
    }
  }, [location]);

  return (
    <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-8 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
      <div className="relative w-full max-w-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (search.trim()) {
              navigate(`/?search=${encodeURIComponent(search.trim())}`);
            } else {
              navigate('/');
            }
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm focus:ring-2 focus:ring-primary outline-none"
            placeholder="Search artists, songs, or albums"
          />
        </form>
      </div>

      <div className="flex items-center gap-6">
        {/* show login or logout based on auth state */}
        {isAuthenticated ? (
          <>
            {currentUser && (
              <span className="text-sm text-slate-700 dark:text-slate-300 mr-4">
                {currentUser}
              </span>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="bg-primary text-background-dark px-6 py-2 rounded-full text-sm font-bold shadow-lg inline-flex items-center justify-center"
            >
              Log Out
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-primary text-background-dark px-6 py-2 rounded-full text-sm font-bold shadow-lg inline-flex items-center justify-center"
          >
            Log In
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;