# UI Example

This directory contains a minimal web interface for the LiteTTS API.

## Running

Start the API server (`npm run dev` from the project root) and then serve this
folder with any static file server. One easy option using Python:

```bash
python3 -m http.server -d example/ui 8080
```

Open [http://localhost:8080](http://localhost:8080) in your browser.
