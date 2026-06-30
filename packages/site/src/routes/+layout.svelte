<script lang="ts">
  import '../app.css';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<div class="layout">
  <nav class="sidebar">
    <div class="sidebar-header">
      <span class="site-title">ship-notes</span>
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
    padding: 1.25rem 1.25rem 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  .site-title {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  .version-list {
    list-style: none;
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

  .content {
    padding: 3.5rem 4rem;
    max-width: 820px;
  }
</style>
