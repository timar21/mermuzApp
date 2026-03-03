import AlbumCard from "../components/AlbumCard";
import { useLibrary } from "../contexts/LibraryContext";
import { usePlaylist } from "../contexts/PlaylistContext";
import { albums } from "../data/albums";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Library() {
  const { libraryAlbums } = useLibrary();
  const { playlists, addPlaylist, removePlaylist, addAlbumToPlaylist } = usePlaylist();
  const [newName, setNewName] = useState('');

  // navigation/query state
  const location = useLocation();
  const navigate = useNavigate();

  // search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');

  // sync search term from query string when location changes (only while on library page)
  useEffect(() => {
    if (!location.pathname.startsWith('/mylab')) return;
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    if (q !== searchTerm) {
      setSearchTerm(q);
    }
  }, [location.search]);

  // update query string when user types in search field
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (searchTerm) {
      if (params.get('search') !== searchTerm) {
        params.set('search', searchTerm);
        navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
      }
    } else {
      if (params.has('search')) {
        params.delete('search');
        navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
      }
    }
  }, [searchTerm]);

  // keep selected playlist defaulted when playlists change
  useEffect(() => {
    if (playlists.length && !selectedPlaylistId) {
      setSelectedPlaylistId(playlists[0].id);
    }
  }, [playlists, selectedPlaylistId]);

  const filteredAlbums = albums.filter((a) => {
    const q = searchTerm.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.artist.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Library</h1>

      {/* playlists section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Playlists</h2>
        <div className="flex gap-2 mb-4">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New playlist name"
            className="flex-1 px-4 py-2 border border-slate-300 rounded"
          />
          <button
            onClick={() => {
              if (newName.trim()) {
                addPlaylist(newName.trim());
                setNewName('');
              }
            }}
            className="px-4 py-2 bg-primary text-background-dark rounded"
          >
            Create
          </button>
        </div>
        {playlists.length === 0 ? (
          <p className="text-slate-500">No playlists yet. Create one above.</p>
        ) : (
          <ul className="space-y-2">
            {playlists.map((pl) => (
              <li key={pl.id} className="flex items-center justify-between">
                <span>{pl.name} ({pl.albums.length})</span>
                <button
                  onClick={() => removePlaylist(pl.id)}
                  className="text-red-500"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* search / add section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Search & Add Albums</h2>
        {playlists.length === 0 ? (
          <p className="text-slate-500 mb-4">
            Create a playlist above before you can add albums.
          </p>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-2 mb-4">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search albums by title or artist"
                className="flex-1 px-4 py-2 border border-slate-300 rounded"
              />
              <select
                value={selectedPlaylistId}
                onChange={(e) => setSelectedPlaylistId(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded"
              >
                <option value="" disabled>
                  -- choose playlist --
                </option>
                {playlists.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name}
                  </option>
                ))}
              </select>
            </div>
            {searchTerm && filteredAlbums.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredAlbums.map((alb, idx) => (
                  <div key={idx} className="relative">
                    <AlbumCard {...alb} />
                    <button
                      onClick={() => {
                        if (selectedPlaylistId) {
                          addAlbumToPlaylist(selectedPlaylistId, alb);
                        }
                      }}
                      disabled={!selectedPlaylistId}
                      className="absolute bottom-2 right-2 px-2 py-1 bg-primary text-background-dark rounded text-xs disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
            {searchTerm && filteredAlbums.length === 0 && (
              <p className="text-slate-500">No matching albums found.</p>
            )}
          </>
        )}
      </div>

      {/* saved albums section */}
      
    </div>
  );
}

export default Library;