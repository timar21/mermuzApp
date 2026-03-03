// Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { usePlaylist } from "../contexts/PlaylistContext";

function Sidebar() {
  const navItems = [
    { icon: "home", label: "Home", to: "/" },
    { icon: "library_music", label: "Library", to: "/mylab" },
    { icon: "favorite", label: "Liked", to: "/liked" },
  ];

  return (
    <aside className="w-64 bg-background-light dark:bg-background-dark min-h-screen p-6 flex flex-col gap-6 border-r border-slate-200 dark:border-primary/5">
      {/* Logo / Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary rounded p-2 flex items-center justify-center">
          <span className="material-symbols-outlined text-background-dark font-bold">pulse_alert</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">MusicStream</h1>
      </div>

      {/* Nav items */}
      {navItems.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <Link
            to={item.to || '#'}
            className="flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>

          {/* plus button next to Library item */}
          {item.label === 'Library' && (
            <Link
              to="/mylab"
              className="ml-auto text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">add</span>
            </Link>
          )}
        </div>
      ))}
      {/* user playlists */}
      <PlaylistLinks />
    </aside>
  );
}


function PlaylistLinks() {
  const { playlists } = usePlaylist();
  if (!playlists || playlists.length === 0) return null;
  return (
    <div className="mt-6">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Playlists
      </h3>
      <ul className="mt-2 space-y-1">
        {playlists.map((pl) => (
          <li key={pl.id}>
            <Link
              to={`/mylab/playlist/${pl.id}`}
              className="ml-4 block text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors text-sm"
            >
              {pl.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;