import cors from "cors";
import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import http from "http";
import https from "https";
import { gracefulShutdown } from "./lib/utils.js";
import { sanitizeQueryParams } from "./middlewares/queryValidation.js";
import { cuisineRouter } from "./routes/cuisine.js";

// Load vars from .env
dotenv.config();
// NODE_ENV
const isProduction = process.env.NODE_ENV === "production";
// Server port, host and http(s)
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || (isProduction ? "0.0.0.0" : "127.0.0.1");
const isHttps = isProduction;
// Allowed frontend origin
const ALLOWED_ORIGIN = process.env.RECIPE_APP_ALLOWED_ORIGIN;
const app = express();

// CORS Middleware: Allow only requests from ALLOWED_ORIGIN
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
  })
);
// Proxy route
app.use("/recipe-api/", sanitizeQueryParams, cuisineRouter);

// Handle errors
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "An internal error occurred" });
});

const options = {};

// Start server
const server = isHttps
  ? https.createServer(options, app)
  : http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(
    `App is listening on a port ${HOST}:${PORT} (${isHttps ? "https" : "http"})`
  );
});

// Set server keepAliveTimeout and headersTimeout
const keepAlive = Number(process.env.KEEP_ALIVE);
const keepAliveTimeout = !isNaN(keepAlive) ? keepAlive : 120;
server.keepAliveTimeout = keepAliveTimeout * 1000;
server.headersTimeout = (keepAliveTimeout + 1) * 1000;

["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
  process.on(signal, () => gracefulShutdown(server))
);

export default app;
