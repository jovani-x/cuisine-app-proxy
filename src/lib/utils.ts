import type http from "http";
import type https from "https";

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

export { gracefulShutdown };
