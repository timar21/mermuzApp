import React from "react";
import { useLiked } from "../contexts/LikedContext";
import { usePlaylist } from "../contexts/PlaylistContext";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function NowPlaying() {
  const { likedAlbums, addAlbum, removeAlbum } = useLiked();
  const { playlists, addAlbumToPlaylist } = usePlaylist();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  // get album information from navigation state, fall back to default
  const defaultAlbum = {
    title: "Midnight City",
    artist: "M83",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAETXuo_AJgmI9Un7ewooeTIHgW2m42XBrrxajwdhZBGsh3-aNGKJ3v2td1hW7i4irvCxiADlQWNU9xwLVRWrpRS0e32rDZhTOq01fLrXJboCdB9q0TB_Fgb9m2MkIvQHgPlBL6LTG123Bwvxb1BguG78C9r8v4SbZmvLdxeW9vKL0JhxKqNbZ2ZjdvwtwrOPjL6PfZCpCVbjoiFtvBaAVYE24SBKFW6H8ud8oANsSWNnXXLJDCdOH_aR48vcJ0lefJuFtKTfJeO5Q"
  };

  const album = location.state?.image ? location.state : defaultAlbum;

  const isLiked = likedAlbums.some(
    (a) => a.title === album.title && a.artist === album.artist
  );

  const handleFavorite = () => {
    if (isLiked) {
      removeAlbum(album);
    } else {
      addAlbum(album);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-primary/5 px-8 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-primary">
            <div className="size-9 bg-primary rounded flex items-center justify-center text-background-dark">
              <span className="play-icon text-2xl">music_note</span>
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">
              StreamMusic
            </h2>
          </div>
          <nav className="hidden md:flex items-center gap-6 ml-4">
            <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-semibold">
              Home
            </Link>
            <a className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-semibold" href="#">
              Library
            </a>
            
          </nav>
        </div>

        {/* Search */}
        <div className="flex flex-1 justify-center max-w-xl px-4">
          <div className="flex w-full max-w-md items-stretch rounded-full bg-slate-200/50 dark:bg-primary/5 border border-transparent focus-within:border-primary/30 transition-all px-4 py-2">
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 mr-2">search</span>
            <input
              className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm"
              placeholder="Search artists, songs, albums"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="bg-primary hover:bg-primary/90 text-background-dark px-6 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/20"
            >
              Log Out
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-primary hover:bg-primary/90 text-background-dark px-6 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/20"
            >
              Log In
            </Link>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Album Art */}
          <div className="flex flex-col items-center lg:items-end justify-center">
            <div className="relative group w-full max-w-md">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 aspect-square">
                <img
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  alt={album.title}
                  src={album.image}
                />
              </div>
            </div>
          </div>

          {/* Song info + controls */}
          <div className="flex flex-col gap-10 w-full max-w-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-slate-900 dark:text-slate-100 text-5xl font-extrabold tracking-tight">
                  {album.title}
                </h1>
                <button
                  onClick={handleFavorite}
                  className={`transition-colors ml-2 ${
                    isLiked
                      ? 'text-red-500 hover:text-red-400'
                      : 'text-slate-400 hover:text-primary'
                  }`}
                >
                  <span className={`play-icon text-3xl material-symbols-${isLiked ? 'rounded' : 'outlined'}`}>
                    {isLiked ? 'favorite' : 'favorite_border'}
                  </span>
                </button>
              </div>
              <p className="text-primary text-2xl font-medium opacity-90">
                {album.artist}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="relative w-full h-2 bg-slate-200 dark:bg-primary/10 rounded-full cursor-pointer group">
                  <div className="absolute top-0 left-0 h-full bg-primary w-2/3 rounded-full"></div>
                  <div className="absolute top-1/2 left-[66%] -translate-y-1/2 size-5 bg-white border-4 border-primary rounded-full shadow-lg opacity-100 scale-100 md:scale-0 md:group-hover:scale-100 transition-transform"></div>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                  <span>2:44</span>
                  <span>4:03</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between px-4">
                <button className="play-icon text-3xl text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                  shuffle
                </button>
                <div className="flex items-center gap-8">
                  <button className="text-5xl text-slate-900 dark:text-slate-100 hover:text-primary transition-transform active:scale-90 play-icon">
                    skip_previous
                  </button>
                  <button className="flex items-center justify-center size-24 rounded-full bg-primary text-background-dark hover:scale-105 active:scale-95 shadow-2xl shadow-primary/40 transition-all play-icon">
                    pause
                  </button>
                  <button className="text-5xl text-slate-900 dark:text-slate-100 hover:text-primary transition-transform active:scale-90 play-icon">
                    skip_next
                  </button>
                </div>
                <button className="play-icon text-3xl text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                  repeat
                </button>
              </div>
            </div>

            {/* Extra Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button
              onClick={() => {
                if (playlists.length === 0) {
                  alert('Create a playlist first in your library');
                  return;
                }
                // simply add to the first playlist for now
                addAlbumToPlaylist(playlists[0].id, album);
              }}
              className="flex-1 bg-slate-200/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-slate-100 py-4 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span className="play-icon text-xl">playlist_add</span>
              Add to Playlist
            </button>
              
             
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 border-t border-slate-200 dark:border-primary/5 bg-background-light dark:bg-background-dark/95 backdrop-blur-md flex items-center justify-between px-10">
        <div className="flex items-center gap-3 w-1/3">
          <span className="play-icon text-primary">devices</span>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Listening on <span className="text-primary font-bold">Living Room Speakers</span>
          </p>
        </div>
        <div className="flex items-center gap-10">
          <span className="play-icon text-slate-500 hover:text-primary transition-colors">lyrics</span>
          <span className="play-icon text-slate-500 hover:text-primary transition-colors">queue_music</span>
        </div>
        <div className="flex items-center gap-4 w-1/3 justify-end">
          <span className="play-icon text-slate-500 dark:text-slate-400">volume_up</span>
          <div className="w-32 h-1.5 bg-slate-200 dark:bg-primary/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-3/4"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default NowPlaying;