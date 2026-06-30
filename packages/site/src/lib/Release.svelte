<script lang="ts">
  import { orderedSections } from '$lib/types';
  import type { Release } from '$lib/types';

  let { release }: { release: Release } = $props();
</script>

<article class="release">
  <header class="page-header">
    <h1 class="page-header-title">v{release.version}</h1>
    {#if release.name}
      <span class="page-header-subtitle">{release.name}</span>
    {/if}
    <time class="page-header-date" datetime={release.date}>{release.date}</time>
  </header>

  {#if release.summary}
    <p class="page-summary">{release.summary}</p>
  {/if}

  {#each orderedSections(release) as { label, section }}
    <section class="release-section">
      <h2 class="section-label">{label}</h2>
      <ul class="item-list">
        {#each section.items as item}
          <li class="item" class:breaking={item.breaking}>
            <span class="item-text">{item.text}</span>
            {#if item.breaking}
              <span class="breaking-badge">breaking</span>
            {/if}
            {#if item.author}
              {@const authorHref = item.link ?? item.author_url}
              {#if authorHref}
                <a class="item-author" href={authorHref} target="_blank" rel="noopener">{item.author}</a>
              {:else}
                <span class="item-author">{item.author}</span>
              {/if}
            {:else if item.link}
              <a class="item-link" href={item.link} target="_blank" rel="noopener">↗</a>
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</article>

<style>
  .release-section {
    margin-bottom: 2.5rem;
  }

  .item-list {
    list-style: none;
    margin-top: 0.25rem;
  }

  .item {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--color-border);
    font-size: 0.875rem;
  }

  .item::before {
    content: '—';
    color: var(--color-border-strong);
    flex-shrink: 0;
    font-size: 0.75rem;
  }

  .item-text {
    flex: 1;
    line-height: 1.6;
  }

  .breaking-badge {
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.15rem 0.4rem;
    border: 1px solid var(--color-breaking);
    color: var(--color-breaking);
    background: var(--color-breaking-bg);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .breaking-badge::before {
    content: '! ';
  }

  .item-link {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    flex-shrink: 0;
    opacity: 0.8;
    transition: opacity 120ms ease;
    padding: 0 0.25rem;
    line-height: 1;
  }

  .item-link:hover {
    opacity: 1;
  }

  .item-author {
    font-size: 0.65rem;
    color: var(--color-text-muted);
    flex-shrink: 0;
    letter-spacing: 0.03em;
    text-decoration: none;
  }

  a.item-author {
    opacity: 0.75;
    transition: opacity 120ms ease;
  }

  a.item-author:hover {
    opacity: 1;
    text-decoration: underline;
  }
</style>
