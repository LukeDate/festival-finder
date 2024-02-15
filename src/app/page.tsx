'use client'
import Spotify from 'next-auth/providers/spotify';
import Login from './components/Login';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
  return (
    <main>
      
      {status === 'authenticated' && <><SignOut /><Playlist /></> }
    </main>
  )
}
