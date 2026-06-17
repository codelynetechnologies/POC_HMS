import { defineConfig } from "vite";
import path from "path";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

const angularDist = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "frontend",
  "dist",
  "hms-frontend",
  "browser",
);

export default defineConfig({
  base: basePath,
  build: {
    outDir: angularDist,
    emptyOutDir: false,
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
