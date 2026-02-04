import { z } from "zod";

export const TextBlock = z.object({
  type: z.literal("text"),
  text: z.string().describe("The textual content of the text block."),
  style: z.enum(["normal", "title", "subtitle", "code"]).default("normal").describe("Rendering style for the text (affects size/weight)."),
});

export const BulletsBlock = z.object({
  type: z.literal("bullets"),
  items: z.array(z.string()).describe("List of bullet point strings shown on the slide."),
});

export const ImageBlock = z.object({
  type: z.literal("image"),
  // src: z.string().url().nullable(),
  // path: z.string().nullable(), // local path allowed instead of URL
  alt: z.string().nullable().describe("Alternative text for the image (for accessibility)."),
  caption: z.string().nullable().describe("Optional caption shown below the image."),
});

export const CodeBlock = z.object({
  type: z.literal("code"),
  language: z.string().nullable().describe("Programming language for syntax highlighting (optional)."),
  code: z.string().describe("Source code content to display in a code block."),
});

export const SlideBlock = z.union([
  TextBlock,
  BulletsBlock,
  ImageBlock,
  CodeBlock,
]);

export const SlideSchema = z.object({
  id: z.number().describe("Serial number for a slide. (example: 1, 2, 3...)"),
  layout: z.string().nullable().describe("Layout template for the slide (example: 'title-slide', 'two-column')."),
  title: z.string().nullable().describe("Optional slide title shown in the header area."),
  blocks: z.array(SlideBlock).default([]).describe("Array of content blocks that make up the slide body."),
  audioNarrationInEnglish: z.string().nullable().describe("Optional English audio narration text for the slide."),
  audioNarrationInHindi: z.string().nullable().describe("Optional Hindi audio narration text for the slide."),
});

export const FrontPageSchema = z.object({
  title: z.string().describe("Presentation front-page title (usually the job position or company presentation title)."),
  // subtitle: z.string().nullable(),
  author: z.string().nullable().describe("Author or presenter name for the front page."),
  date: z.string().nullable().describe("Optional date string to show on the front page."),
});

export const PresentationSchema = z.object({
  id: z.string().nullable().describe("Optional identifier for the presentation."),
  title: z.string().nullable().describe("Presentation title (appears in file metadata and viewers)."),
  description: z.string().nullable().describe("Short description or summary of the presentation content (e.g., job description summary)."),
  theme: z.string().nullable().describe("Visual theme or color scheme name to apply to the slides."),
  frontPage: FrontPageSchema.nullable().describe("Optional front page metadata for the presentation."),
  slides: z.array(SlideSchema).min(1).describe("Ordered array of slides comprising the presentation (at least one)."),
  createdAt: z.string().nullable().describe("Timestamp when the presentation was created."),
  logo: z.string().nullable().describe("Timestamp when the presentation was created.")
  // metadata: z.record(z.any()).optional(),
});

export type Presentation = z.infer<typeof PresentationSchema>;
export type Slide = z.infer<typeof SlideSchema>;
export type SlideBlockType = z.infer<typeof SlideBlock>;