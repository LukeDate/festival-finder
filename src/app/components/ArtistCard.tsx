import { useState } from "react";

const ArtistCard = ({ artist, isLoading }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="mb-4 p-2 border border-gray-800 rounded-md shadow-md transition-transform duration-300 transform hover:scale-105 hover:bg-gray-800 relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {isLoading ? (
            <div className="h-20 w-20 bg-gray-700 animate-pulse rounded-md"></div>
          ) : (
            <>
              <div
                className={`h-20 w-20 object-cover mb-2 rounded-md overflow-hidden ${
                  isHovered ? 'animate-spin-open' : ''
                }`}
              >
                <img
                  className="h-full w-full"
                  src={artist.images[0].url}
                  alt={artist.name}
                />
              </div>
              <div
                className={`absolute bottom-0 left-0 right-0 text-white text-center transition-all duration-300 transform ${
                  isHovered ? 'translate-y-0' : 'translate-y-full'
                }`}
              >
                <div className="text-sm font-bold mb-1">{artist.name}</div>
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue text-xs"
                >
                  View on Spotify
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

export default ArtistCard;