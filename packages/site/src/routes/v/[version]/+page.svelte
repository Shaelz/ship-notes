<script lang="ts">
  import Release from '$lib/Release.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<Release release={data.release} />
