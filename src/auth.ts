
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";
import { authConfig } from "../auth.config";

// Helper function to refresh the access token
async function refreshAccessToken(token: JWT): Promise<JWT> {
    console.log("Refreshing access token", token);
    
    try {
        const response = await fetch(`${process.env.API_SERVER_BASE_URL}/api/auth/refresh`, {
            headers: {
                "Authorization": `Bearer ${token.refreshToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const tokens = await response.json();

        return {
            ...token,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken ?? token.refreshToken, // Fall back to old refresh token
            accessTokenExpires: jwtDecode<any>(tokens.accessToken).exp * 1000, // Update the expiration time
        };
    } catch (error) {
        console.error('Error refreshing access token:', error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
  ...authConfig,
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                try {
                    const res = await fetch(
                        `${process.env.API_SERVER_BASE_URL}/api/auth/login`,
                        {
                            method: "POST",
                            body: JSON.stringify({
                                email: credentials.email,
                                password: credentials.password,
                            }),
                            headers: { "Content-Type": "application/json" },
                        }
                    );

                    if (!res.ok) {
                        // Invalid credentials
                        return null;
                    }

                    const parsedResponse = await res.json();

                    const accessToken = parsedResponse.accessToken;
                    const refreshToken = parsedResponse.refreshToken;
                    const userInfo = parsedResponse?.userInfo;

                    return {
                        accessToken,
                        refreshToken,
                        name: userInfo?.name,
                        role: userInfo?.role,
                        email: userInfo?.email
                    };
                } catch (e) {
                    console.error('Authorization error:', e);
                    return null;
                }
            },
        }),
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID || "",
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        //     authorization: {
        //         params: {
        //             prompt: "consent",
        //             access_type: "offline",
        //             response_type: "code",
        //         },
        //     },
        // }),
        
    ],
    callbacks: {
        jwt: async ({ token, account, user }) => {
            if (token.accessToken) {
                const decodedToken = jwtDecode<any>(token.accessToken);
                token.accessTokenExpires = decodedToken.exp * 1000;
            }

            // If it's the first time signing in, append user data to token
            if (account && user) {
                return {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    
                    user: {
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                };
            }

            // Check if the access token is still valid
            if (Date.now() < token.accessTokenExpires!) {
                return token;
            }

            // If the access token has expired, refresh it
            return refreshAccessToken(token);
        },
        session: async ({ session, token }) => {
            if (token) {
                session.accessToken = token.accessToken;
                session.user = {
                  // ...token.user
                    name: token.user?.name || "",
                    email: token.user?.email || "",
                    role: token.user?.role || "",
                };
            }
            return session;
        },
    },
});
