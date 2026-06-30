#!/usr/bin/env node
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { execSync } from "node:child_process";
import { parseReleaseFile, ParseError } from "./parse.js";
import { renderChangelog } from "./render/markdown.js";
import { compareSemver } from "./semver.js";
import { add } from "./add.js";
import { init } from "./init.js";
import { open } from "./open.js";
import { diff } from "./diff.js";
import { digest } from "./digest.js";
import { publish } from "./publish.js";
import { notify } from "./notify.js";
import { preview } from "./preview.js";
import { validate } from "./validate.js";
import { latest } from "./latest.js";
import { loadConfig } from "./config.js";

function gitAuthorName(): string {
  try {
    return execSync("git config user.name", { encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

const [, , command = "help", ...args] = process.argv;

function flagValue(flag: string): string | undefined {
  const entry = args.find((a) => a.startsWith(`${flag}=`));
  if (entry) return entry.slice(flag.length + 1);
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1]!.startsWith('--')) return args[idx + 1];
  return undefined;
}

function build(): void {
  const cwd = process.cwd();
  const config = loadConfig(cwd);
  const defaultAuthor = config.default_author || gitAuthorName();
  const releasesDir = resolve(cwd, config.releases_dir ?? "releases");
  const since = flagValue("--since")?.replace(/^v/, "");

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
        const defaultAuthorUrl = config.default_author_url || '';
        for (const section of Object.values(release.sections)) {
          for (const item of section.items) {
            if (!item.author) item.author = defaultAuthor;
            if (!item.author_url && defaultAuthorUrl) item.author_url = defaultAuthorUrl;
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

  const filtered = since
    ? releases.filter((r) => compareSemver(r.version, since) <= 0)
    : releases;

  if (filtered.length === 0) {
    console.error(`Error: no releases found after v${since}`);
    process.exit(1);
  }

  const outDir = resolve(cwd, config.output_dir ?? "changelog");
  mkdirSync(outDir, { recursive: true });

  const markdown = renderChangelog(filtered);
  const outPath = join(outDir, "CHANGELOG.md");
  writeFileSync(outPath, markdown, "utf-8");

  console.log(`Built ${filtered.length} release(s) → ${config.output_dir}/CHANGELOG.md`);
}

switch (command) {
  case "init":
    init();
    break;
  case "build":
    build();
    break;
  case "add":
    add(args[0]);
    break;
  case "open":
    open();
    break;
  case "diff":
    diff(args[0]);
    break;
  case "digest":
    digest(args[0]);
    break;
  case "publish": {
    const flags = args.filter((a) => a.startsWith('--'));
    const versionArg = args.find((a) => !a.startsWith('--'));
    publish(flags, versionArg);
    break;
  }
  case "notify":
    notify(args[0]);
    break;
  case "preview":
    preview();
    break;
  case "validate":
    validate();
    break;
  case "latest":
    latest();
    break;
  default:
    console.log("Usage: ship-notes <command>");
    console.log("");
    console.log("Commands:");
    console.log("  init                                Set up ship-notes in a new project");
    console.log("  add [patch|minor|major|<version>]   Scaffold a new release file");
    console.log("  build [--since <version>]           Assemble releases/ into changelog/CHANGELOG.md");
    console.log("  validate                            Check all release files for errors");
    console.log("  latest                              Print the latest version number");
    console.log("  open                                Open the deployed changelog in the browser");
    console.log("  preview                             Start a local preview of the changelog site");
    console.log("  diff [<version>|<v1>..<v2>]         Print release(s) as Markdown to stdout");
    console.log("  digest [<version>]                  Write an HTML email digest to changelog/");
    console.log("  publish --github [<version>]        Post a release to GitHub Releases");
    console.log("  notify [<version>]                  Send a release summary to Slack or Discord");
}
