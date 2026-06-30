<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const description =
    'A CLI + static site tool that turns structured TOML release files into a human-readable changelog.';
</script>

<svelte:head>
  <title>About | {data.siteTitle}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={`About | ${data.siteTitle}`} />
  <meta property="og:description" content={description} />
  {#if data.siteUrl}
    <link rel="canonical" href={`${data.siteUrl}/about`} />
    <meta property="og:url" content={`${data.siteUrl}/about`} />
  {/if}
</svelte:head>

<article class="about">

  <header class="page-header">
    <h1 class="page-header-title">about</h1>
    <span class="page-header-subtitle">ship-notes</span>
  </header>

  <p class="page-summary">
    A CLI + static site tool that turns structured TOML release files into a
    human-readable changelog. Write releases in plain text, publish a site,
    post to GitHub Releases, notify Slack or Discord — all from one command.
  </p>

  <section class="doc-section">
    <h2 class="section-label">INSTALL</h2>
    <pre class="code-block">npm install -D ship-notes
# or
pnpm add -D ship-notes</pre>
  </section>

  <section class="doc-section">
    <h2 class="section-label">QUICK START</h2>
    <ul class="cmd-list">
      <li><code>ship-notes init</code> — interactive setup wizard, creates <code>ship-notes.toml</code> and <code>releases/</code></li>
      <li><code>ship-notes add</code> — scaffold a new release TOML file for the next version</li>
      <li><code>ship-notes build</code> — compile all releases into static HTML + Markdown</li>
      <li><code>ship-notes preview</code> — start the local SvelteKit dev server</li>
      <li><code>ship-notes validate</code> — check all release files for schema errors</li>
    </ul>
  </section>

  <section class="doc-section">
    <h2 class="section-label">COMMANDS</h2>
    <ul class="cmd-list">
      <li><code>ship-notes diff [version]</code> — print one or more releases as Markdown to stdout</li>
      <li><code>ship-notes diff v1.0.0..v1.4.0</code> — print a range of releases</li>
      <li><code>ship-notes digest [version]</code> — write an HTML email digest to <code>changelog/</code></li>
      <li><code>ship-notes open</code> — open the configured changelog URL in the system browser</li>
      <li><code>ship-notes latest</code> — print the latest version number to stdout</li>
      <li><code>ship-notes publish --github</code> — post a release to GitHub Releases via API</li>
      <li><code>ship-notes notify</code> — send a release summary to a Slack or Discord webhook</li>
      <li><code>ship-notes build --since &lt;version&gt;</code> — build only releases at or after a version</li>
    </ul>
  </section>

  <section class="doc-section">
    <h2 class="section-label">CONFIG</h2>
    <p class="doc-p">All fields live in <code>ship-notes.toml</code> at the project root.</p>
    <ul class="cmd-list">
      <li><code>title</code> — site title shown in the header and RSS feed</li>
      <li><code>url</code> — public URL of the deployed changelog site</li>
      <li><code>repo</code> — GitHub repository URL, used by <code>ship-notes publish</code></li>
      <li><code>releases_dir</code> — directory for TOML release files (default: <code>releases/</code>)</li>
      <li><code>output_dir</code> — build output directory (default: <code>changelog/</code>)</li>
      <li><code>default_author</code> — author name applied to items with no explicit author; falls back to <code>git config user.name</code></li>
      <li><code>default_author_url</code> — fallback link for author tags when no commit link is present</li>
      <li><code>notify_webhook</code> — Slack or Discord webhook URL; can also be set via <code>SHIP_NOTES_WEBHOOK</code> env var</li>
    </ul>
  </section>

  <section class="doc-section">
    <h2 class="section-label">RELEASE FORMAT</h2>
    <p class="doc-p">Each release is a <code>.toml</code> file in <code>releases/</code>.</p>
    <pre class="code-block">version = "1.0.0"
date    = "2026-06-30"
name    = "Optional release name"
summary = "Optional one-line summary shown above the changelog."

[sections.new]

[[sections.new.items]]
text   = "Added something great"
link   = "https://github.com/you/repo/commit/abc123"
author = "yourname"

[[sections.new.items]]
text     = "Removed old API"
breaking = true

[sections.fixed]

[[sections.fixed.items]]
text = "Fixed a bug"</pre>
    <p class="doc-p">Standard section keys: <code>new</code>, <code>fixed</code>, <code>changed</code>, <code>removed</code>. Any custom key also works.</p>
  </section>

  <section class="doc-section">
    <h2 class="section-label">SOURCE</h2>
    <ul class="cmd-list">
      <li><a href="https://github.com/Shaelz/ship-notes" target="_blank" rel="noopener">github.com/Shaelz/ship-notes</a> — source code, issues, PRs</li>
      <li><a href="/feed.xml">feed.xml</a> — RSS feed for this changelog</li>
    </ul>
  </section>

</article>

<style>
  .about {
    max-width: 680px;
  }

  .doc-section {
    margin-bottom: 2.5rem;
  }

  .doc-p {
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--color-text-muted);
    margin-bottom: 0.75rem;
  }

  .cmd-list {
    list-style: none;
    font-size: 0.875rem;
  }

  .cmd-list li {
    padding: 0.55rem 0;
    border-bottom: 1px solid var(--color-border);
    line-height: 1.6;
  }

  .cmd-list li::before {
    content: '— ';
    color: var(--color-border-strong);
    font-size: 0.75rem;
  }

  .cmd-list a {
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .cmd-list a:hover {
    color: var(--color-text-muted);
  }

  code {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    background: var(--color-hover);
    padding: 0.1em 0.35em;
    border: 1px solid var(--color-border);
  }

  .code-block {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    line-height: 1.7;
    background: var(--color-sidebar);
    border: 1px solid var(--color-border-strong);
    padding: 1rem;
    overflow-x: auto;
    white-space: pre;
    margin-bottom: 0.75rem;
    color: var(--color-text);
  }
</style>
