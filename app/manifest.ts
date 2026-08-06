import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Auto Resource Updater",
    short_name: "Resource Updater",
    description: "Safely update FiveM resources without losing configuration.",
    start_url: "/",
    display: "standalone",
    background_color: "#080b0e",
    theme_color: "#080b0e",
  };
}
