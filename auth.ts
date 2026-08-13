import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Next.js receives the public host through its request headers. In local
  // development and behind a controlled reverse proxy, Auth.js must be
  // allowed to use that host when building session and callback URLs.
  trustHost: true,
  providers: [Discord],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    authorized: async ({ auth }) => Boolean(auth),
    jwt: async ({ token, account }) => {
      if (account?.provider === "discord")
        token.discordId = account.providerAccountId;
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user)
        session.user.id = String(token.discordId || token.sub || "");
      return session;
    },
  },
});
