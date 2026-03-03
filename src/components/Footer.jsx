// components/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="h-24 border-t border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-slate-400">music_note</span>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Select a song
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            to start listening
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">queue_music</span>
        </button>
        <button className="text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">devices</span>
        </button>
      </div>
    </footer>
  );
}

export default Footer;