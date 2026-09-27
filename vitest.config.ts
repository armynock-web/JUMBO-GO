import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./scripts/test-setup.ts"],
    include: ["tests/**/*.test.ts"],
    globals: true,
    hookTimeout: 30000,
    testTimeout: 30000,
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts", "src/app/api/**/route.ts"],
      reporter: ["text", "json-summary"],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 70,
      },
    },
  },
});