// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user }) {
//       try {
//         await fetch("http://localhost:8000/api/users/google-login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             name: user.name,
//             email: user.email,
//             image: user.image,
//           }),
//         });
//         return true;
//       } catch (err) {
//         console.error("Google Login Failed:", err);
//         return false;
//       }
//     },
//     async jwt({ token, user }) {
//       return token;
//     },
//     async session({ session, token }) {
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });


import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // Do NOT gate sign-in.
  callbacks: {
    async signIn() {
      // never block OAuth on our side
      return true;
    },
    async jwt({ token }) {
      return token;
    },
    async session({ session }) {
      return session;
    },
  },

  // Fire-and-forget user sync AFTER sign-in succeeded.
  events: {
    async signIn({ user }) {
      try {
        const base =
          (process.env.NEXTAUTH_URL || "").replace(/\/$/, "") ||
          "http://localhost:3000"; // dev safety

        await fetch(`${base}/api/users/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user?.name,
            email: user?.email,
            image: user?.image,
          }),
        }).catch(() => {}); // ignore network failures on purpose
      } catch (err) {
        // don't throw — this must never block sign-in
        console.error("events.signIn sync failed:", err);
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  // Optional UX
  pages: {
    signIn: "/user/login",
    error: "/user/login",
  },
});
