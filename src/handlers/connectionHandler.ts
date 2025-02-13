import net from "net";
import { Database, Command } from "../types/database";
import { activeConfig } from "../config/config";

const isValidCommand = (cmd: string): cmd is Command => {
  return ["SET", "GET", "DELETE"].includes(cmd);
};

export const handleConnection = (socket: net.Socket, database: Database) => {
  console.log("Client connected:", socket.remoteAddress);

  socket.setTimeout(activeConfig.timeout || 20000); // by default 20 seconds

  socket.on("timeout", () => {
    console.log("Connection timeout");
    socket.end();
  });

  socket.on("data", (data) => {
    const input = data.toString().trim();
    const parts = input.split(" ");
    const command = parts[0];

    if (!isValidCommand(command)) {
      socket.write("Invalid Command Passed\n");
      return;
    }

    try {
      switch (command) {
        case "SET":
          if (parts.length < 3) {
            socket.write("Invalid SET command. Usage: SET key value\n");
            return;
          }
          const key = parts[1];
          const value = parts.slice(2).join(" ");
          database.set(key, value);
          socket.write(`Key: ${key} Value: ${value} is SET\n`);
          console.log("Data Set");
          database.print();
          break;

        case "GET":
          if (parts.length !== 2) {
            socket.write("Invalid GET command. Usage: GET key\n");
            return;
          }
          const getValue = database.get(parts[1]);
          socket.write(getValue ? `${getValue}\n` : "Key not found\n");
          console.log("Data Get");
          database.print();
          break;

        case "DELETE":
          if (parts.length !== 2) {
            socket.write("Invalid DELETE command. Usage: DELETE key\n");
            return;
          }
          database.delete(parts[1]);
          socket.write("Deleted Key Successfully\n");
          console.log("Data Deleted");
          database.print();
          break;
      }
    } catch (err) {
      let errorMessage = "An unknown error occurred";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      socket.write(`Error: ${errorMessage}\n`);
    }
  });

  socket.on("end", () => {
    console.log("Client disconnected:", socket.remoteAddress);
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
};
