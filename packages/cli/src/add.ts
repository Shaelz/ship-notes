import { readdirSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { parseSemver, compareSemver, parseReleaseFile } from "@ship-notes/core";

type BumpType = "patch" | "minor" | "major";

function bump(version: string, type: BumpType): string {
  const [maj, min, pat] = parseSemver(version);
  if (type === "major") return `${maj + 1}.0.0`;
  if (type === "minor") return `${maj}.${min + 1}.0`;
  return `${maj}.${min}.${pat + 1}`;
}

function isBumpType(s: string): s is BumpType {
  return s === "patch" || s === "minor" || s === "major";
}

function isExplicitVersion(s: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(s);
}

function latestVersion(releasesDir: string): string | null {
  let files: string[];
  try {
    files = readdirSync(releasesDir).filter((f) => f.endsWith(".toml"));
  } catch {
    return null;
  }

  const versions: string[] = [];
  for (const file of files) {
    try {
      versions.push(parseReleaseFile(join(releasesDir, file)).version);
    } catch {
      // skip invalid files
    }
  }
  return versions.sort(compareSemver)[0] ?? null;
}

function scaffold(version: string): string {
  const today = new Date().toISOString().slice(0, 10);
  return `version = "${version}"
date = "${today}"
# name = ""       # optional display name, e.g. "Summer Update"
# summary = ""    # optional one-line blurb shown above sections

[sections.new]
# label = "What's New"   # optional label override

[[sections.new.items]]
text = ""
# author = ""                 # optional, overrides default_author from ship-notes.toml

# [sections.fixed]
#
# [[sections.fixed.items]]
# text = ""
#
# [sections.changed]
#
# [[sections.changed.items]]
# text = ""
# breaking = true
#
# [sections.removed]
#
# [[sections.removed.items]]
# text = ""
`;
}

export function add(arg: string = "patch"): void {
  const cwd = process.cwd();
  const releasesDir = resolve(cwd, "releases");

  let nextVersion: string;

  if (isExplicitVersion(arg)) {
    nextVersion = arg;
  } else if (isBumpType(arg)) {
    const current = latestVersion(releasesDir);
    if (!current) {
      if (arg !== "patch") {
        console.error(
          `Error: no existing releases found. Provide an explicit version instead: ship-notes add 1.0.0`
        );
        process.exit(1);
      }
      nextVersion = "0.1.0";
    } else {
      nextVersion = bump(current, arg);
    }
  } else {
    console.error(
      `Error: invalid argument "${arg}". Use patch, minor, major, or an explicit version like 1.2.0`
    );
    process.exit(1);
  }

  mkdirSync(releasesDir, { recursive: true });

  const outPath = join(releasesDir, `v${nextVersion}.toml`);
  if (existsSync(outPath)) {
    console.error(`Error: releases/v${nextVersion}.toml already exists`);
    process.exit(1);
  }

  writeFileSync(outPath, scaffold(nextVersion), "utf-8");
  console.log(`Created releases/v${nextVersion}.toml`);
}
