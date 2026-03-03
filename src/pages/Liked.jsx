import AlbumCard from "../components/AlbumCard";
import { useLiked } from "../contexts/LikedContext";

function Liked() {
  const { likedAlbums } = useLiked();

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Liked Albums</h1>
      {likedAlbums.length === 0 ? (
        <p className="text-slate-500">No albums liked yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {likedAlbums.map((album, idx) => (
            <AlbumCard key={idx} {...album} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Liked;