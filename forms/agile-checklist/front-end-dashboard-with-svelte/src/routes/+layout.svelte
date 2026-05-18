<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  let { children }: { children: Snippet } = $props();
</script>

<div class="max-w-7xl mx-auto p-6">
  <header class="mb-4 pb-3 border-b">
    <h1 class="text-2xl font-bold text-brand-600">Agile Checklist Dashboard</h1>
    <p class="text-sm text-slate-600">
      Recent checklist submissions, composite maturity, and operational flags.
    </p>
    <nav class="mt-2 text-sm flex gap-3">
      <a href="/" class="text-brand-700 hover:underline">Submissions</a>
      <a href="/comparison" class="text-brand-700 hover:underline">Principles vs. behaviour</a>
    </nav>
  </header>
  {@render children()}
</div>
