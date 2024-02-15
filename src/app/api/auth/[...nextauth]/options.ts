import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
      const basicAuth = Buffer.from(`${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`).toString(
        'base64'
      )
      const res: any = await fetch(
        'https://accounts.spotify.com/api/token',
        {
            method: 'POST',
            body: `grant_type=refresh_token&refresh_token=${token.refreshToken}`,
            headers: {
                Authorization: `Basic ${basicAuth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
      )
      const data = await res.json()
      return {
        ...token,
        accessToken: data.access_token,
        accessTokenExpires: Date.now() + data.expires_in * 1000,
      }
    } catch (error) {
        console.log('an error ocurred', error)
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      }
    }
  }

export const options: NextAuthOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ? process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID : '',
            clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET ? process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET : ''
        })
    ],
    session: { strategy: 'jwt'},
    secret: process.env.NEXT_PUBLIC_JWT_SECRET,
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
              return {
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                accessTokenExpires: account.expires_at ? account.expires_at * 1000 : account.expires_at,
                user,
              }
            }
            if (token.accessTokenExpires && Date.now().toString < token.accessTokenExpires) {
              return token
            }
            const newToken = await refreshAccessToken(token)
            return newToken
        },
        async session({ session, token }) {
            
            return Promise.resolve({...session, ...token})
        },
    }
}

