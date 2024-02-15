import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import Image from "next/image";
import PlaylistCard from "./PlaylistCard";
import ArtistCard from "./ArtistCard";
import SignOut from "./SignOut";
const Playlists = () => {
    const [playlists, setPlaylists] = useState<any>([]);
    const [relatedArtists, setRelatedArtists] = useState([]);
    const [visibleArtists, setVisibleArtists] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [showArtists, setShowArtists] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
    
        return () => clearTimeout(timeout);
      }, []);

    const {data, status}: any = useSession();
    const authParams = status === 'unauthenticated' ? {} : {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${data && data.accessToken}`
        }
       }

      
    const getUserPlaylist = async () => {
       const response = await fetch('https://api.spotify.com/v1/me/playlists', authParams)

       if(response.ok) {
        const playlistsData = await response.json();
        setPlaylists(playlistsData.items);
       } else {
        console.error('Failed to fetch user playlists');
       }
    };

    const getSimilarArtists = async (artistId: string) => {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, authParams)
        if(response.ok) {
            const data = await response.json();
            return data.artists;
        } else {
            console.error('an error occurred')
            return [];
        }
    }

    const getById = async (artistId: string) => {
        const res = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, authParams);
        const data = await res.json()
        return data;
    }

    const getSimilarArtistsForPlaylist = async (id: number) => {
        const relatedArtistsSet = new Set();
        const res = await fetch(playlists[id].tracks.href, authParams)
        const json = await res.json()
        const artistsData = json.items.map((item: any) => item.track.artists).flat();
        const relatedArtistsPromise = artistsData.map(async (artist: any) => {
            const relatedArtists = await getSimilarArtists(artist.id)
            relatedArtists.forEach((relatedArtist: any) => {
                relatedArtistsSet.add(relatedArtist.id);
            })
        })
        try {
            await Promise.all(relatedArtistsPromise);
            try {
                await Promise.all(relatedArtistsPromise);
                const allRelatedArtists = Array.from(relatedArtistsSet);
                const a = allRelatedArtists.slice(0,visibleArtists).map((artistId: any) => getById(artistId))
                const prom: any = await Promise.all(a);
                setRelatedArtists(prom);
            } catch (error) {
                console.error('error fetching related artists');
            }        } catch (error) {
            console.error('error fetching related artists');
        }
        setShowArtists(true);
    }

    useEffect(() => {
        (data && status === 'authenticated') && getUserPlaylist();
    }, [data, status]);



    return (
        <div className="flex flex-row">
        <div
            className={`w-full h-[calc(100vh-72px)] mt-16 overflow-y-scroll p-4 ${
            showArtists ? 'w-1/2' : ''
            } transition-width duration-300`}
        > 
        
            <h2 className="text-3xl font-bold mb-4 text-white w-full">Your Playlists</h2>
          
          <div className="flex flex-wrap justify-around">
            {playlists.map((playlist: any, id: number) => (
              <PlaylistCard key={id} playlist={playlist} onGetSimilarArtists={() => getSimilarArtistsForPlaylist(id)} />
            ))}
          </div>
        </div>
        <div
        className={`w-1/2 h-[calc(100vh-72px)] mt-16 p-4 overflow-y-scroll bg-gray-900 transition-transform duration-300 transform ${
          showArtists ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <h2 className="text-3xl font-bold mb-4 text-white">Similar Artists</h2>
        {relatedArtists.map((artist) => (
          // eslint-disable-next-line react/jsx-key
          <ArtistCard isLoading={isLoading} artist={artist} />
        ))}
      </div> 
      </div>
  );
};



export default Playlists;