import React from "react";
import { useParams, Link } from "react-router-dom";
import { usePlaylist } from "../contexts/PlaylistContext";
import AlbumCard from "../components/AlbumCard";

function PlaylistPage() {
  const { playlistId } = useParams();
  const { playlists, removeAlbumFromPlaylist } = usePlaylist();
  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) {
    return (
      <div className="flex-1 flex flex-col overflow-y-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Playlist not found</h1>
        <Link to="/mylab" className="text-primary">
          Back to library
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{playlist.name}</h1>
      <Link to="/mylab" className="text-primary mb-4 inline-block">
        &larr; Back to library
      </Link>
      {playlist.albums.length === 0 ? (
        <p className="text-slate-500">No albums in this playlist.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {playlist.albums.map((album, idx) => (
            <div key={idx} className="relative">
              <AlbumCard {...album} />
              <button
                onClick={() => removeAlbumFromPlaylist(playlistId, album)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded px-2 py-1 text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlaylistPage;
