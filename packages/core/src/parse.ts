import { readFileSync } from "node:fs";
import { parse as parseTOML } from "smol-toml";
import { ZodError } from "zod";
import { ReleaseSchema, type Release } from "./schema.js";

export class ParseError extends Error {
  constructor(
    public readonly file: string,
    message: string
  ) {
    super(`${file}: ${message}`);
    this.name = "ParseError";
  }
}

function formatZodError(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "root";
      return `  ${path}: ${issue.message}`;
    })
    .join("\n");
}

export function parseReleaseFile(filePath: string): Release {
  let raw: string;
  try {
    raw = readFileSync(filePath, "utf-8");
  } catch {
    throw new ParseError(filePath, "file not found or not readable");
  }

  let parsed: unknown;
  try {
    parsed = parseTOML(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ParseError(filePath, `invalid TOML — ${message}`);
  }

  const result = ReleaseSchema.safeParse(parsed);
  if (!result.success) {
    throw new ParseError(
      filePath,
      `schema validation failed:\n${formatZodError(result.error)}`
    );
  }

  return result.data;
}
