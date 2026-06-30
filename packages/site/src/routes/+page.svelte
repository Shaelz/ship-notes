<script lang="ts">
  import { orderedSections } from '$lib/types';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

{#if data.release}
  <article class="release">
    <header class="release-header">
      <h1 class="release-version">v{data.release.version}</h1>
      {#if data.release.name}
        <span class="release-name">{data.release.name}</span>
      {/if}
      <time class="release-date" datetime={data.release.date}>{data.release.date}</time>
    </header>

    {#if data.release.summary}
      <p class="release-summary">{data.release.summary}</p>
    {/if}

    {#each orderedSections(data.release) as { label, section }}
      <section class="release-section">
        <h2 class="section-label">{label}</h2>
        <ul class="item-list">
          {#each section.items as item}
            <li class="item" class:breaking={item.breaking}>
              <span class="item-text">{item.text}</span>
              {#if item.breaking}
                <span class="breaking-badge">breaking</span>
              {/if}
              {#if item.link}
                <a class="item-link" href={item.link} target="_blank" rel="noopener">#</a>
              {/if}
              {#if item.author}
                {#if item.link}
                  <a class="item-author" href={item.link} target="_blank" rel="noopener">{item.author}</a>
                {:else}
                  <span class="item-author">{item.author}</span>
                {/if}
              {/if}
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </article>
{:else}
  <p>No releases yet.</p>
{/if}

<style>
  .release-header {
    display: flex;
    align-items: baseline;
    gap: 1.25rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
    padding-bottom: 1.25rem;
    border-bottom: 2px solid var(--color-border-strong);
  }

  .release-version {
    font-size: 2.4rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .release-name {
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--color-text-muted);
    align-self: center;
  }

  .release-date {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    margin-left: auto;
    align-self: center;
    letter-spacing: 0.04em;
  }

  .release-summary {
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--color-text-muted);
    border-left: 3px solid var(--color-border-strong);
    padding-left: 1rem;
    margin-bottom: 2.5rem;
  }

  .release-section {
    margin-bottom: 2.5rem;
  }

  .section-label {
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.25em;
    color: var(--color-text-muted);
    margin: 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border-strong);
  }

  .item-list {
    list-style: none;
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
    font-size: 0.7rem;
    color: var(--color-text-muted);
    flex-shrink: 0;
    opacity: 0.5;
  }

  .item-link:hover {
    opacity: 1;
    text-decoration: underline;
  }

  .item-author {
    font-size: 0.65rem;
    color: var(--color-text-muted);
    opacity: 0.6;
    flex-shrink: 0;
    letter-spacing: 0.03em;
    text-decoration: none;
  }

  .item-author:hover {
    opacity: 1;
    text-decoration: underline;
  }
</style>
