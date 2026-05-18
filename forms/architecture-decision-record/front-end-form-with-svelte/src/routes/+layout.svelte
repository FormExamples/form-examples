<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  let { children }: { children: Snippet } = $props();
</script>

<div class="max-w-5xl mx-auto px-4 py-6">
  <header class="mb-6 pb-4 border-b border-slate-200">
    <h1 class="text-2xl font-bold text-brand-700">Architecture Decision Record</h1>
    <p class="text-sm text-slate-600">
      Tyree &amp; Akerman 14-section template — capture an ADR in one wizard, render Markdown.
    </p>
  </header>
  {@render children()}
</div>
