import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://muskanroy.com",
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/reports/") && !page.endsWith("/message-sent/"),
    }),
  ],
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
