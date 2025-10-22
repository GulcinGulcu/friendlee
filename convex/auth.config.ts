import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://joint-husky-84.clerk.accounts.dev/",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
