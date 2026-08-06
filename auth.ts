import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Discord],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    authorized: async ({ auth }) => Boolean(auth),
  },
});
