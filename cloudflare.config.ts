import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    "name": "kora-desk",
    "compatibilityDate": "2026-10-01",
    "observability": {
      "enabled": true
    },
    "entrypoint": "dist/_worker.js/index.js",
    "compatibilityFlags": [
      "global_fetch_strictly_public"
    ],
    "env": {
      "ASSETS": {
        "type": "assets"
      }
    }
  }
});
