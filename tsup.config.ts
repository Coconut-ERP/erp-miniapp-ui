import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    cn: "src/cn.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // "use client" is prepended only onto dist/index.* in scripts/copy-styles.mjs
  // so cn stays usable from Server Components via @erp/miniapp-ui/cn.
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "radix-ui",
    "lucide-react",
    "sonner",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
  ],
});
