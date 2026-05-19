<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  import { store } from '$lib/stores/checklist.svelte.js';
  import { onMount } from 'svelte';

  let { children }: { children: Snippet } = $props();
  let loaded = $state(false);

  onMount(() => {
    store.loadFromLocalStorage();
    loaded = true;
  });

  // Persist any change to localStorage.
  $effect(() => {
    if (loaded) {
      // Touch reactive properties so the effect re-runs.
      const _ = store.data;
      void _;
      store.saveToLocalStorage();
    }
  });
</script>

<div class="max-w-5xl mx-auto px-4 py-6">
  <header class="mb-6 pb-4 border-b border-slate-200">
    <h1 class="text-2xl font-bold text-brand-700">
      WHO Surgical Safety Checklist
    </h1>
    <p class="text-sm text-slate-600">
      Three-phase operating-room safety checklist: Sign In, Time Out, Sign Out.
    </p>
  </header>
  {@render children()}
</div>
