import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/explore", "/wisdom", "/login", "/signup"],
      disallow: ["/journal", "/reflect", "/me", "/sit", "/admin", "/api/", "/home", "/practice"],
    },
  };
}
