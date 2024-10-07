import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "ch9ua2h3",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});