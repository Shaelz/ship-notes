<script lang="ts">
  import Release from '$lib/Release.svelte';
  import { releaseTitle, releaseDescription } from '$lib/seo';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{releaseTitle(data.release)} | {data.siteTitle}</title>
  <meta name="description" content={releaseDescription(data.release)} />
  <meta property="og:title" content={releaseTitle(data.release)} />
  <meta property="og:description" content={releaseDescription(data.release)} />
  {#if data.siteUrl}
    <link rel="canonical" href={`${data.siteUrl}/v/${data.release.version}`} />
    <meta property="og:url" content={`${data.siteUrl}/v/${data.release.version}`} />
  {/if}
</svelte:head>

<Release release={data.release} />
