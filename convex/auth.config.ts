export default {
    providers: [
      {
        // Must be the Clerk JWT issuer, e.g. "https://vast-cat-63.clerk.accounts.dev"
        domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
        // Must match your Clerk JWT Template audience; default is often "convex"
        applicationID:"convex",
      },
    ]
  };