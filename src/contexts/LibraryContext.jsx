import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const LibraryContext = createContext();

export function LibraryProvider({ children }) {
  const { currentUser } = useAuth();
  const [libraryAlbums, setLibraryAlbums] = useState([]);

  // load when user changes
  useEffect(() => {
    if (!currentUser) {
      setLibraryAlbums([]);
      return;
    }
    try {
      const stored = localStorage.getItem(`libraryAlbums_${currentUser}`);
      setLibraryAlbums(stored ? JSON.parse(stored) : []);
    } catch {
      setLibraryAlbums([]);
    }
  }, [currentUser]);

  // persist when albums or user change
  useEffect(() => {
    if (!currentUser) return;
    try {
      localStorage.setItem(`libraryAlbums_${currentUser}`, JSON.stringify(libraryAlbums));
    } catch {}
  }, [libraryAlbums, currentUser]);

  const addAlbum = (album) => {
    setLibraryAlbums((prev) => {
      if (prev.find((a) => a.title === album.title && a.artist === album.artist)) {
        return prev;
      }
      return [...prev, album];
    });
  };

  const removeAlbum = (album) => {
    setLibraryAlbums((prev) => prev.filter((a) => !(a.title === album.title && a.artist === album.artist)));
  };

  return (
    <LibraryContext.Provider value={{ libraryAlbums, addAlbum, removeAlbum }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  return useContext(LibraryContext);
}
