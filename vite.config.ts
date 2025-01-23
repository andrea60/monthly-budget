import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isProdBuild = command === "build";

  let plugins = [react(), TanStackRouterVite()];

  if (isProdBuild)
    plugins = [
      ...plugins,
      viteStaticCopy({
        targets: [
          {
            src: "envs/prod/settings.json",
            dest: "public",
          },
        ],
      }),
    ];

  return {
    plugins,
  };
});
