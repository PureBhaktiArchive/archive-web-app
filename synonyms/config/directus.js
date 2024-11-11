import { createDirectus, rest, staticToken } from "@directus/sdk";

const client = createDirectus(process.env.DIRECTUS_URL)
  .with(staticToken(process.env.DIRECTUS_STATIC_TOKEN))
  .with(rest());

export { client };
