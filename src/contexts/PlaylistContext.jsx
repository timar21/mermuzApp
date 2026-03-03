import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PlaylistContext = createContext();

export function PlaylistProvider({ children }) {
  const { currentUser } = useAuth();
  const [playlists, setPlaylists] = useState([]);

  // load when user changes
  useEffect(() => {
    if (!currentUser) {
      setPlaylists([]);
      return;
    }
    try {
      const stored = localStorage.getItem(`playlists_${currentUser}`);
      setPlaylists(stored ? JSON.parse(stored) : []);
    } catch {
      setPlaylists([]);
    }
  }, [currentUser]);

  // persist when playlists or user change
  useEffect(() => {
    if (!currentUser) return;
    try {
      localStorage.setItem(`playlists_${currentUser}`, JSON.stringify(playlists));
    } catch {}
  }, [playlists, currentUser]);

  const addPlaylist = (name) => {
    setPlaylists((prev) => [
      ...prev,
      { id: Date.now().toString(), name, albums: [] },
    ]);
  };

  const removePlaylist = (id) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  };

  const addAlbumToPlaylist = (playlistId, album) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p;
        // avoid duplicates
        if (
          p.albums.find((a) => a.title === album.title && a.artist === album.artist)
        ) {
          return p;
        }
        return { ...p, albums: [...p.albums, album] };
      })
    );
  };

  const removeAlbumFromPlaylist = (playlistId, album) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p;
        return {
          ...p,
          albums: p.albums.filter(
            (a) => !(a.title === album.title && a.artist === album.artist)
          ),
        };
      })
    );
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        addPlaylist,
        removePlaylist,
        addAlbumToPlaylist,
        removeAlbumFromPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  return useContext(PlaylistContext);
}