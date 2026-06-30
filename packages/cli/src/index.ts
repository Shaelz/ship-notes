#!/usr/bin/env node
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { execSync } from "node:child_process";
import { parseReleaseFile, ParseError } from "./parse.js";
import { renderChangelog } from "./render/markdown.js";
import { compareSemver } from "./semver.js";
import { add } from "./add.js";
import { loadConfig } from "./config.js";

function gitAuthorName(): string {
  try {
    return execSync("git config user.name", { encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

const [, , command = "help", ...args] = process.argv;

function build(): void {
  const cwd = process.cwd();
  const config = loadConfig(cwd);
  const defaultAuthor = config.default_author || gitAuthorName();
  const releasesDir = resolve(cwd, config.releases_dir ?? "releases");

  let files: string[];
  try {
    files = readdirSync(releasesDir).filter((f) => f.endsWith(".toml"));
  } catch {
    console.error(`Error: no ${config.releases_dir}/ directory found. Run from your project root.`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`Error: no .toml files found in ${config.releases_dir}/`);
    process.exit(1);
  }

  const releases = [];
  let hasErrors = false;

  for (const file of files) {
    try {
      const release = parseReleaseFile(join(releasesDir, file));
      if (defaultAuthor) {
        for (const section of Object.values(release.sections)) {
          for (const item of section.items) {
            if (!item.author) {
              item.author = defaultAuthor;
            }
          }
        }
      }
      releases.push(release);
    } catch (err) {
      if (err instanceof ParseError) {
        console.error(err.message);
        hasErrors = true;
      } else {
        throw err;
      }
    }
  }

  if (hasErrors) process.exit(1);

  releases.sort((a, b) => compareSemver(a.version, b.version));

  const outDir = resolve(cwd, config.output_dir ?? "changelog");
  mkdirSync(outDir, { recursive: true });

  const markdown = renderChangelog(releases);
  const outPath = join(outDir, "CHANGELOG.md");
  writeFileSync(outPath, markdown, "utf-8");

  console.log(`Built ${releases.length} release(s) → ${config.output_dir}/CHANGELOG.md`);
}

switch (command) {
  case "build":
    build();
    break;
  case "add":
    add(args[0]);
    break;
  default:
    console.log("Usage: ship-notes <command>");
    console.log("");
    console.log("Commands:");
    console.log("  add [patch|minor|major|<version>]   Scaffold a new release file");
    console.log("  build                               Assemble releases/ into changelog/CHANGELOG.md");
}
