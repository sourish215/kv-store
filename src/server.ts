import dotenv from "dotenv";
dotenv.config(); // Load environment variables first

import net from "net";
import { KeyValueDatabase } from "./database/KeyValueDatabase";
import { handleConnection } from "./handlers/connectionHandler";
import { activeConfig } from "./config/config";
import { Database } from "./types/database";

class Server {
  // private database: KeyValueDatabase;
  private database: Database;
  private server: net.Server;

  constructor() {
    this.database = new KeyValueDatabase();
    this.server = net.createServer((socket) =>
      handleConnection(socket, this.database)
    );
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    // Handle server-level errors
    this.server.on("error", (err) => {
      console.error("Server error:", err);
      process.exit(1);
    });

    // Handle process-level errors
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      this.shutdown();
    });

    process.on("SIGTERM", () => {
      console.log("Received SIGTERM signal");
      this.shutdown();
    });

    process.on("SIGINT", () => {
      console.log("Received SIGINT signal");
      this.shutdown();
    });
  }

  private shutdown(): void {
    console.log("Shutting down server...");
    this.server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });

    // Force close after 5 seconds
    setTimeout(() => {
      console.error(
        "Could not close connections in time, forcefully shutting down"
      );
      process.exit(1);
    }, 5000);
  }

  public start(): void {
    this.server.listen(activeConfig.port, () => {
      console.log(`Server started on PORT ${activeConfig.port}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`Timeout set to: ${activeConfig.timeout}ms`);
    });
  }
}

// Create and start server
try {
  const server = new Server();
  server.start();
} catch (err) {
  if (err instanceof Error) {
    console.error("Failed to start server:", err.message);
  } else {
    console.error("An unknown error occurred while starting the server");
  }
  process.exit(1);
}
