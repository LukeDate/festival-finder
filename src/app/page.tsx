'use client'
import Spotify from 'next-auth/providers/spotify';
import Login from './components/Login';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import Playlist from './components/Playlist';
import SignOut from './components/SignOut';

export default function Home() {
  const { data: session, status} = useSession();
  const navigation = useRouter();
  useEffect(() => {
    if(status === 'unauthenticated') {
      navigation.push('/api/auth/signin');
    }
  }, [status])

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch('/api/gpt-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artists: ["lane 8", "grum", "yotto"] }),
      });
     } catch(error) {
        console.log('Error', error);
     }
  }, []);
  

  // useEffect(() => {
    
  //   fetchEvents();
  // }, []);
  
  return (
    <main>
      <button style={{ height: 50, width: 100, color: 'red', marginTop: 100}} onClick={() => fetchEvents()}>Click for gpt</button>
      {status === 'authenticated' && <><SignOut /><Playlist /></> }
    </main>
  )
}
