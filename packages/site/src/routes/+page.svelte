<script lang="ts">
  import Release from '$lib/Release.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

{#if data.release}
  <Release release={data.release} />
{:else}
  <p>No releases yet.</p>
{/if}
