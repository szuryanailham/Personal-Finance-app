import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Artoku",
    short_name: "Artoku",
    lang: "id",
    start_url: "/login",
    scope: "/",
    display: "standalone",
    background_color: "#F3F3FC",
    theme_color: "#F3F3FC",
    icons: [
      {
        src: "/pwa/artoku-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa/artoku-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
