import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PromptViewer from "./PromptViewer";

/* ───────────────────────────────────────────────────────────────
   PROMPT DATA
   Add new prompts here. Each key maps to /prompts/<key>.
   ─────────────────────────────────────────────────────────────── */
const promptsData: Record<string, { title: string; content: string }> = {
  "1": {
    title: "Prompt 1",
    content: "prompt1",
  },
};

/* ───────────────────────────────────────────────────────────────
   METADATA
   ─────────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const prompt = promptsData[id];

  if (!prompt) {
    return {
      title: "404 — Page Not Found",
      description: "This prompt does not exist.",
    };
  }

  return {
    title: `${prompt.title} — Aryan Chaudhary`,
    description: `View and copy: ${prompt.content.slice(0, 140)}`,
  };
}

/* ───────────────────────────────────────────────────────────────
   PAGE COMPONENT
   ─────────────────────────────────────────────────────────────── */
export default async function PromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = promptsData[id];

  if (!prompt) {
    notFound();
  }

  return <PromptViewer title={prompt.title} content={prompt.content} />;
}
