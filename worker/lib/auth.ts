import { createClerkClient } from "@clerk/backend";
import { Context } from "hono";

interface SessionClaims {
  sub: string;
  email?: string;
  companyId?: string;
  role?: string;
  [key: string]: unknown;
}

export function createAuth(secretKey: string) {
  if (!secretKey) {
    console.error("❌ Clerk secret key is missing");
    throw new Error("Clerk secret key is required");
  }
  console.log("✅ Clerk secret key loaded:", secretKey.substring(0, 10) + "...");
  return createClerkClient({ secretKey });
}

export async function getAuthUser(
  c: Context
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

  const clerkClient = createAuth(process.env.CLERK_SECRET_KEY!);

  try {
    const session = await clerkClient.authenticateRequest(c.req.raw, {
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
    });

    if (!session.isAuthenticated) {
      console.log("Unauthenticated Clerk session");
      return null;
    }

    const sessionClaims = session.toAuth().sessionClaims;
    
    // Get user metadata from Clerk
    const userId = sessionClaims.sub;
    const user = await clerkClient.users.getUser(userId);
    
    const claims = {
      ...sessionClaims,
      companyId: user.privateMetadata?.companyId as string,
      role: user.privateMetadata?.role as string,
    };
    
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
  c: Context
): Promise<null | {
  user: SessionClaims;
  clerkClient: ReturnType<typeof createAuth>;
}> {
  const result = await getAuthUser(c);
  return result?.user && result?.clerkClient ? result : null;
}
