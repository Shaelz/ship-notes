<script lang="ts">
  import '../app.css';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<div class="layout">
  <nav class="sidebar">
    <div class="sidebar-header">
      <a href="/" class="brand">
        <svg class="logo" viewBox="0 0 20 22" width="20" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="1.75" y="1.75" width="12.5" height="16.5" stroke="currentColor" stroke-width="1.5"/>
          <line x1="5" y1="7" x2="11" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
          <line x1="5" y1="11" x2="11" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
          <line x1="5" y1="15" x2="9" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
          <polyline points="14.25,1.75 18.25,5.75" stroke="currentColor" stroke-width="1.5"/>
          <polyline points="14.25,1.75 14.25,5.75 18.25,5.75 18.25,18.25 14.25,18.25" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <span class="site-title">ship-notes</span>
      </a>
    </div>
    <ul class="version-list">
      {#each data.releases as release, i}
        <li class:current={i === 0}>
          <a href="/v/{release.version}">
            <span class="version-number">v{release.version}</span>
            {#if release.name}
              <span class="version-name">{release.name}</span>
            {/if}
            <span class="version-date">{release.date}</span>
          </a>
        </li>
      {/each}
    </ul>
    <div class="sidebar-footer">
      <a href="/about" class="footer-link">about &amp; docs</a>
      <a href="/feed.xml" class="footer-link">rss feed</a>
    </div>
  </nav>

  <main class="content">
    {@render children()}
  </main>
</div>

<style>
  .layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    min-height: 100vh;
  }

  .sidebar {
    background: var(--color-sidebar);
    border-right: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    scrollbar-width: thin;
    scrollbar-color: var(--color-border-strong) var(--color-sidebar);
  }

  .sidebar::-webkit-scrollbar {
    width: 4px;
  }

  .sidebar::-webkit-scrollbar-track {
    background: var(--color-sidebar);
  }

  .sidebar::-webkit-scrollbar-thumb {
    background: var(--color-border-strong);
  }

  .sidebar::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-muted);
  }

  .sidebar-header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--color-border);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: var(--color-text-muted);
  }

  .brand:hover {
    color: var(--color-text);
  }

  .logo {
    flex-shrink: 0;
    color: inherit;
  }

  .site-title {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .version-list {
    list-style: none;
    flex: 1;
  }

  .version-list li {
    border-bottom: 1px solid var(--color-border);
    border-left: 3px solid transparent;
    transition: background 120ms ease;
  }

  .version-list li.current {
    background: var(--color-bg);
    border-left-color: var(--color-current-dot);
  }

  .version-list a {
    display: flex;
    flex-direction: column;
    padding: 0.75rem 1.25rem 0.75rem 1rem;
    gap: 0.15rem;
  }

  .version-list a:hover {
    background: var(--color-hover);
  }

  .version-number {
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.03em;
  }

  .version-list li.current .version-number {
    color: var(--color-current-dot);
  }

  .version-name {
    font-size: 0.7rem;
    color: var(--color-text-muted);
  }

  .version-date {
    font-size: 0.65rem;
    color: var(--color-text-muted);
  }

  .sidebar-footer {
    border-top: 1px solid var(--color-border);
    padding: 0.75rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .footer-link {
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    color: var(--color-text-muted);
    opacity: 0.7;
    transition: opacity 120ms ease;
  }

  .footer-link:hover {
    opacity: 1;
  }

  .content {
    padding: 3.5rem 4rem;
    max-width: 820px;
  }
</style>
