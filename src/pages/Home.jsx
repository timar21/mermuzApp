import Header from "../components/Header";
import AlbumCard from "../components/AlbumCard";
import { albums as allAlbums } from "../data/albums";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

function Home() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get('search') || '';
  const albums = allAlbums.filter((a) => {
    const q = searchTerm.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.artist.toLowerCase().includes(q)
    );
  });

  const { isAuthenticated } = useAuth();

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <Header />
      <div className="p-8 space-y-12">
       {/* {!isAuthenticated && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded p-4">
            You can browse albums freely, but you must log in to play tracks, like albums, or build your library.
          </div>
       )}}*/}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recently Played</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {albums.map((album, index) => (
              <AlbumCard key={index} {...album} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;