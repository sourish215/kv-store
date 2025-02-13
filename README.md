# TypeScript Key-Value Store

A lightweight TCP-based key-value store server implemented in TypeScript. This project provides a simple, in-memory database with basic CRUD operations.

## Features

- In-memory key-value storage
- TCP server implementation
- Support for SET, GET, and DELETE operations
- Connection timeout handling
- TypeScript type safety
- Environment-based configuration
- Graceful shutdown handling

## Prerequisites

- Node.js (v14 or higher)
- pnpm (v6 or higher)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd key-value-store
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the project root:

```env
PORT=8080
TIMEOUT=10000
NODE_ENV=development
```

## Project Structure

```
src/
├── config/
│   └── config.ts         # Configuration settings
├── database/
│   └── KeyValueDatabase.ts   # Database implementation
├── handlers/
│   └── connectionHandler.ts  # TCP connection handler
├── types/
│   └── database.ts      # TypeScript interfaces
└── server.ts            # Main server file
```

## Usage

1. Start the server:

```bash
pnpm start
```

2. Connect to the server using netcat or telnet:

```bash
nc localhost 8080
# or
telnet localhost 8080
```

3. Available commands:

```
SET key value     # Store a key-value pair
GET key           # Retrieve a value by key
DELETE key        # Remove a key-value pair
```

Example session:

```
SET mykey Hello World
> Key: mykey Value: Hello World is SET

GET mykey
> Hello World

DELETE mykey
> Deleted Key Successfully
```

## Configuration

The server can be configured through environment variables or the config file:

- `PORT`: Server port number (default: 8080)
- `TIMEOUT`: Connection timeout in milliseconds (default: 10000)
- `NODE_ENV`: Environment mode (development/production)

## API Client Usage

```typescript
import net from "net";

const client = new net.Socket();
client.connect(8080, "localhost", () => {
  // Store a value
  client.write("SET mykey myvalue\n");

  // Retrieve a value
  client.write("GET mykey\n");
});

client.on("data", (data) => {
  console.log("Received:", data.toString());
});
```

## Error Handling

The server includes error handling for:

- Invalid commands
- Connection timeouts
- Server errors
- Process termination signals

## Running in Production

For production deployment:

1. Set environment variables:

```env
NODE_ENV=production
PORT=3000
TIMEOUT=5000
```

2. Use a process manager:

```bash
npm install -g pm2
pm2 start dist/server.js
```

## Development

1. Run in development mode:

```bash
pnpm start:dev
```

2. Run tests:

```bash
pnpm test
```

3. Build for production:

```bash
pnpm build
```

## Limitations

- In-memory storage (data is lost on server restart)
- No authentication/authorization
- Single-instance only (no clustering)
- Basic command parsing
- No data persistence

## Future Improvements

- Add data persistence
- Implement authentication
- Add clustering support
- Add more complex data types
- Add transaction support
- Implement pub/sub functionality
- Add monitoring and metrics

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
