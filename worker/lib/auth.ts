import { createClerkClient } from "@clerk/backend";
import { Context } from "hono";

type Bindings = {
  NEON_DATABASE_URL: string;
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  ASSETS: Fetcher;
};
interface SessionClaims {
  sub: string;
  email?: string;
  companyId?: string;
  [key: string]: unknown;
}

export function createAuth(secretKey: string) {
  return createClerkClient({ secretKey });
}

export async function getAuthUser(
  c: Context<{ Bindings: Bindings; Variables: {} }>
): Promise<null | {
  user: SessionClaims;
  clerkClient: ReturnType<typeof createAuth>;
}> {
  const authHeader = c.req.header("Authorization");
  console.log("auth header", authHeader);
  if (!authHeader?.startsWith("Bearer ")) {
    console.log("null");
    return null;
  }

  const clerkClient = createAuth(c.env.CLERK_SECRET_KEY);

  try {
    const session = await clerkClient.authenticateRequest(c.req.raw, {
      publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
    });

    if (!session.isAuthenticated) {
      console.log("Unauthenticated Clerk session");
      return null;
    }

    const claims = session.toAuth().sessionClaims;
    console.log("Authenticated session:", claims);

    return {
      user: claims,
      clerkClient,
    };
  } catch (err) {
    console.error("Clerk auth error:", err);
    return null;
  }
}

export async function requireAuth(
  c: Context<{ Bindings: Bindings; Variables: {} }>
): Promise<null | {
  user: SessionClaims;
  clerkClient: ReturnType<typeof createAuth>;
}> {
  const result = await getAuthUser(c);
  return result?.user && result?.clerkClient ? result : null;
}
