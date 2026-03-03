import { useNavigate } from 'react-router-dom';
import { useLiked } from '../contexts/LikedContext';
import { useAuth } from '../contexts/AuthContext';

function AlbumCard({ image, title, artist, onFavorite }) {
  const navigate = useNavigate();
  const { likedAlbums, addAlbum, removeAlbum } = useLiked();
  const { isAuthenticated } = useAuth();

  const isLiked = likedAlbums.some(
    (a) => a.title === title && a.artist === artist
  );

  const handleClick = () => {
    if (!isAuthenticated) {
      // send to login page, remember where we came from so we can redirect back
      navigate('/login', {
        state: {
          from: { pathname: '/now-playing', album: { image, title, artist } },
        },
      });
      return;
    }

    navigate('/now-playing', {
      state: { image, title, artist },
    });
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }
    // prefer using context directly if available
    if (isLiked) {
      removeAlbum({ image, title, artist });
    } else if (onFavorite) {
      onFavorite({ image, title, artist });
    } else {
      addAlbum({ image, title, artist });
    }
  };

  return (
    <div onClick={handleClick} className="group bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer">
      <div className="relative aspect-square mb-4 overflow-hidden rounded shadow-lg">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button className="absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full shadow-xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="material-symbols-outlined text-background-dark font-bold">
            play_arrow
          </span>
        </button>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="font-bold truncate">{title}</h3>
        <button
          onClick={handleFavorite}
          className={
            `transition-colors ml-2 ${isLiked ? 'text-red-500 hover:text-red-400' : 'text-primary hover:text-primary/80'}`
          }
        >
          <span className={`material-symbols-${isLiked ? 'rounded' : 'outlined'}`}>
            {isLiked ? 'favorite' : 'favorite_border'}
          </span>
        </button>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
        {artist}
      </p>
    </div>
  );
}

export default AlbumCard;