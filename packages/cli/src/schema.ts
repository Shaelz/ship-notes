import { z } from "zod";

const Item = z.object({
  text: z.string().min(1, "Item text cannot be empty"),
  link: z.string().url("Item link must be a valid URL").optional(),
  breaking: z.boolean().optional(),
  author: z.string().optional(),
});

const Section = z.object({
  label: z.string().optional(),
  items: z.array(Item).min(1, "Section must have at least one item"),
});

const STANDARD_SECTION_KEYS = ["new", "fixed", "changed", "removed"] as const;

export type StandardSectionKey = (typeof STANDARD_SECTION_KEYS)[number];

export const SECTION_DEFAULTS: Record<StandardSectionKey, string> = {
  new: "New",
  fixed: "Fixed",
  changed: "Changed",
  removed: "Removed",
};

export const SECTION_ORDER: StandardSectionKey[] = [
  "new",
  "fixed",
  "changed",
  "removed",
];

export const ReleaseSchema = z.object({
  version: z
    .string()
    .regex(
      /^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/,
      "version must be a valid semver string (e.g. 1.2.0)"
    ),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format"),
  name: z.string().optional(),
  summary: z.string().optional(),
  sections: z
    .record(z.string(), Section)
    .refine(
      (sections) => Object.keys(sections).length > 0,
      "Release must have at least one section"
    ),
});

export type Release = z.infer<typeof ReleaseSchema>;
export type ReleaseItem = z.infer<typeof Item>;
export type ReleaseSection = z.infer<typeof Section>;
