import type http from "http";
import type https from "https";
import type { UserRequest } from "../types/user.js";

type SameSiteType = "strict" | "lax" | "none";

const gracefulShutdown = (server: https.Server | http.Server) => {
  console.log("Shutting down gracefully...");

  server.close((err) => {
    if (err) {
      console.error("Error shutting down server:", err);
      process.exit(1);
    }

    console.log("Server closed successfully.");
    process.exit(0);
  });
};

// Return token lifetime, hours
const getTokenLifetime = () => {
  return (Number(process.env.AUTH_TOKEN_LIFETIME) || 24) * 3600000;
};

// Return name of cookie with token
const getAuthCookieName = () => {
  return process.env.AUTH_COOKIE_NAME || "proxy-token";
};

// Return token
const getTokenFromRequest = (req?: UserRequest): string | undefined => {
  const cookieName = getAuthCookieName();
  return req?.cookies?.[cookieName]
    ? String(req.cookies[cookieName])
    : undefined;
};

// Return https on/of
const isHttpsOn = () => {
  const HTTPS_VALUES = new Set(["true", "1", "on"]);
  return HTTPS_VALUES.has(process.env.HTTPS_ON?.toLowerCase() || "");
};

// Return sameSite mode
const getSameSite = (): SameSiteType => {
  const validValues: SameSiteType[] = ["strict", "lax", "none"];
  const value = process.env.SAME_SITE?.toLowerCase() as
    | SameSiteType
    | undefined;
  return validValues.includes(value!) ? value! : "lax";
};

const isProd = () => process.env.NODE_ENV === "production";

export {
  getAuthCookieName,
  getSameSite,
  getTokenFromRequest,
  getTokenLifetime,
  gracefulShutdown,
  isHttpsOn,
  isProd,
};
export type { SameSiteType };
