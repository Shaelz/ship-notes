<script lang="ts">
  import Release from '$lib/Release.svelte';
  import { releaseTitle, releaseDescription } from '$lib/seo';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  {#if data.release}
    <title>{releaseTitle(data.release)} | {data.siteTitle}</title>
    <meta name="description" content={releaseDescription(data.release)} />
    <meta property="og:title" content={releaseTitle(data.release)} />
    <meta property="og:description" content={releaseDescription(data.release)} />
    {#if data.siteUrl}
      <link rel="canonical" href={data.siteUrl} />
      <meta property="og:url" content={data.siteUrl} />
    {/if}
  {/if}
</svelte:head>

{#if data.release}
  <Release release={data.release} />
{:else}
  <p>No releases yet.</p>
{/if}
