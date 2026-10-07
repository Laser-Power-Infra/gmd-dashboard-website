import { OAuth2Client, type Credentials } from "google-auth-library";
import fs from "fs";
import path from "path";

/**
 * Singleton OAuth2 client for the Google Sheets reads behind the Engineering
 * Data page.
 *
 * Credentials live in `credentials.json` (OAuth client id/secret) and
 * `token.json` (a long-lived refresh token) at the project root — the same pair
 * the GMD dashboards use, and both listed in `.gitignore`.
 *
 * This module is server-only: it reads the filesystem and holds a refresh token.
 * Import it only from a Route Handler or a Server Component, never from a
 * `"use client"` file.
 *
 * On refresh the client emits new tokens, which are written back to
 * `token.json`. That is best-effort — a read-only filesystem (a serverless
 * host) still works, because the refresh token itself does not rotate; only the
 * short-lived access token is lost, and it is recomputed on the next call.
 */

let oauth2ClientInstance: OAuth2Client | null = null;

export function getOAuthClient(): OAuth2Client {
  if (oauth2ClientInstance) return oauth2ClientInstance;

  const credentialsPath = path.join(process.cwd(), "credentials.json");
  const tokenPath = path.join(process.cwd(), "token.json");

  if (!fs.existsSync(credentialsPath)) {
    throw new Error(
      `Missing credentials.json in the project root. Expected: ${credentialsPath}`,
    );
  }
  if (!fs.existsSync(tokenPath)) {
    throw new Error(
      `Missing token.json in the project root. Expected: ${tokenPath}`,
    );
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8")) as {
    installed?: {
      client_id: string;
      client_secret: string;
      redirect_uris?: string[];
    };
    web?: {
      client_id: string;
      client_secret: string;
      redirect_uris?: string[];
    };
  };
  const tokenData = JSON.parse(fs.readFileSync(tokenPath, "utf8")) as {
    token?: string;
    access_token?: string;
    refresh_token?: string;
    expiry?: string;
    scopes?: string[];
  };

  const clientInfo = credentials.installed ?? credentials.web;
  if (!clientInfo) {
    throw new Error(
      "Invalid credentials.json: expected an 'installed' or 'web' root key.",
    );
  }

  const oauth2Client = new OAuth2Client(
    clientInfo.client_id,
    clientInfo.client_secret,
    clientInfo.redirect_uris?.[0] ?? "http://localhost",
  );

  oauth2Client.setCredentials({
    access_token: tokenData.token ?? tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expiry_date: tokenData.expiry ? new Date(tokenData.expiry).getTime() : undefined,
    scope: tokenData.scopes?.join(" "),
  });

  oauth2Client.on("tokens", (tokens: Credentials) => {
    try {
      const current = JSON.parse(fs.readFileSync(tokenPath, "utf8")) as Record<
        string,
        unknown
      >;
      fs.writeFileSync(
        tokenPath,
        JSON.stringify(
          {
            ...current,
            token: tokens.access_token ?? current.token,
            refresh_token: tokens.refresh_token ?? current.refresh_token,
            expiry: tokens.expiry_date
              ? new Date(tokens.expiry_date).toISOString()
              : current.expiry,
          },
          null,
          2,
        ),
        "utf8",
      );
    } catch {
      // Read-only filesystem: the in-memory client still refreshes for this
      // process, so the request succeeds. Nothing to do.
    }
  });

  oauth2ClientInstance = oauth2Client;
  return oauth2Client;
}

/** A currently-valid access token, refreshing if needed. */
export async function getAccessToken(): Promise<string> {
  const client = getOAuthClient();
  const { token } = await client.getAccessToken();
  if (!token) {
    throw new Error(
      "Google OAuth returned no access token — check credentials.json and token.json.",
    );
  }
  return token;
}
