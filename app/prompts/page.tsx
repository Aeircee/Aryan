import { notFound } from "next/navigation";

/**
 * /prompts should not be accessible.
 * Any visit to this route triggers the custom 404.
 */
export default function PromptsIndex() {
  notFound();
}