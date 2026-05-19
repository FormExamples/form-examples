<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    void goto('/checklist/0', { replaceState: true });
  });
</script>

<section class="prose max-w-none">
  <p class="text-slate-700">Loading WHO Surgical Safety Checklist wizard…</p>
  <p>
    <a href="/checklist/0" class="text-brand-700 underline">
      Start the checklist at Step 0 — Case details
    </a>
  </p>
</section>
