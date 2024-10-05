import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
export default defineConfig(() => {
  return {
    base: "react-todo-app",
    build: {
      outDir: "build",
      sourcemap: true,
      target: "esnext",
    },
    plugins: [react()],
    resolve: {
      alias: [{ find: "@", replacement: "/src" }],
    },
  };
});
