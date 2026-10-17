
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      include: ["src"],
      exclude: ["src/main.ts"],
      insertTypesEntry: true,
    }),
  ],

  build: {
    copyPublicDir: false,
    lib: {
      entry: fileURLToPath(
        new URL("./src/index.ts", import.meta.url),
      ),
      formats: ["es"],
      fileName: "index",
      cssFileName: "style",
    },
    rollupOptions: {
      external: ["vue", "clsx", "tailwind-merge"],
    },
  },
});
