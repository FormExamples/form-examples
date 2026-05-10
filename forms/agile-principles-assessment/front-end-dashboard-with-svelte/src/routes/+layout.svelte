<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  let { children }: { children: Snippet } = $props();
</script>

<div class="max-w-7xl mx-auto p-6">
  <header class="mb-4 pb-3 border-b">
    <h1 class="text-2xl font-bold text-brand-600">Agile Principles Dashboard</h1>
    <p class="text-sm text-slate-600">
      Recent assessment submissions, composite maturity, and operational flags.
    </p>
  </header>
  {@render children()}
</div>
