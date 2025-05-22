# Usage Guide

This document outlines how to run the litetts server or use it from the command line during development.

## Running the API Server

Use `pnpm` to start the development server via `tsx`:

```bash
pnpm dev
```

By default the server listens on port `3000`. You can change the port with the `PORT` environment variable:

```bash
PORT=4000 pnpm dev
```

Visit `http://localhost:3000/healthz` to verify the server is running.

## CLI Mode

The entry script also supports a simple CLI mode. Run it with the `MODE` variable set to `cli`:

```bash
MODE=cli npx tsx src/index.ts
```

This prints a short greeting to stdout. The CLI mode is useful for quick smoke tests without starting the HTTP server.

## Testing

Execute the test suite with:

```bash
pnpm test
```

The tests build the project and send requests to a temporary local server to validate all endpoints.
