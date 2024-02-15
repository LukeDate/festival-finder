import { useEffect, useState } from "react";

const PlaylistCard = ({ playlist, onGetSimilarArtists }: any) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
        <div
        className="mb-8 relative group overflow-hidden w-64 h-64 mx-auto bg-gradient-to-b from-purple-800 to-indigo-700 rounded-md shadow-md transform hover:scale-105 transition-transform duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-full h-full relative">
          <img
            className="w-full h-full object-cover filter brightness-75 group-hover:brightness-100 rounded-md"
            src={playlist.images[0].url}
            alt={playlist.name}
          />
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center transition-opacity duration-300">
            {/* Background for title and button */}
            <div className={`bg-gray-800 bg-opacity-75 rounded-md p-4 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-lg font-bold mb-2 text-white">{playlist.name}</div>
              <button
                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
                onClick={onGetSimilarArtists}
              >
                Get similar artists
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default PlaylistCard;