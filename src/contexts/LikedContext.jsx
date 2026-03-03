import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const LikedContext = createContext();

export function LikedProvider({ children }) {
  const { currentUser } = useAuth();
  const [likedAlbums, setLikedAlbums] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      setLikedAlbums([]);
      return;
    }
    try {
      const stored = localStorage.getItem(`likedAlbums_${currentUser}`);
      setLikedAlbums(stored ? JSON.parse(stored) : []);
    } catch {
      setLikedAlbums([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    try {
      localStorage.setItem(`likedAlbums_${currentUser}`, JSON.stringify(likedAlbums));
    } catch {}
  }, [likedAlbums, currentUser]);

  const addAlbum = (album) => {
    setLikedAlbums((prev) => {
      if (prev.find((a) => a.title === album.title && a.artist === album.artist)) {
        return prev;
      }
      return [...prev, album];
    });
  };

  const removeAlbum = (album) => {
    setLikedAlbums((prev) => prev.filter((a) => !(a.title === album.title && a.artist === album.artist)));
  };

  return (
    <LikedContext.Provider value={{ likedAlbums, addAlbum, removeAlbum }}>
      {children}
    </LikedContext.Provider>
  );
}

export function useLiked() {
  return useContext(LikedContext);
}