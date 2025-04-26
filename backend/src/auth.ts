import { NodePostgresAdapter } from "@lucia-auth/adapter-***REMOVED***ql";
import { Lucia } from "lucia";
import pg from "pg";

const pool = new pg.Pool();

const adapter = new NodePostgresAdapter(pool, {
  user: "auth_user",
  session: "user_session",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
