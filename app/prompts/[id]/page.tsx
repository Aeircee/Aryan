import type { Metadata } from "next";
import PromptViewer from "./PromptViewer";

/* ───────────────────────────────────────────────────────────────
   PROMPT DATA
   Add new prompts to this record as needed.
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
  return {
    title: prompt
      ? `${prompt.title} — Aryan Chaudhary`
      : "Prompt Not Found — Aryan Chaudhary",
    description: prompt
      ? `View and copy: ${prompt.content.slice(0, 120)}`
      : "This prompt does not exist.",
  };
}

/* ───────────────────────────────────────────────────────────────
   PAGE COMPONENT (Server)
   ─────────────────────────────────────────────────────────────── */
export default async function PromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = promptsData[id];

  if (!prompt) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-5 font-sans">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Prompt not found</h1>
          <p className="mt-2 text-white/50">
            No prompt exists with id <code className="text-white/70">{id}</code>.
          </p>
        </div>
      </main>
    );
  }

  return <PromptViewer title={prompt.title} content={prompt.content} />;
}
