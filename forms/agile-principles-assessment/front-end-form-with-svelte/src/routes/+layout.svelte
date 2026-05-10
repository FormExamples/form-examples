<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  let { children }: { children: Snippet } = $props();
</script>

<div class="max-w-5xl mx-auto px-4 py-6">
  <header class="mb-6 pb-4 border-b border-slate-200">
    <h1 class="text-2xl font-bold text-brand-700">Agile Principles Assessment</h1>
    <p class="text-sm text-slate-600">
      Score your team or organisation against the 12 Agile Manifesto principles
      and generate a coaching action plan.
    </p>
  </header>
  {@render children()}
  <footer class="mt-12 pt-4 border-t border-slate-200 text-xs text-slate-500">
    Based on the Manifesto for Agile Software Development (Beck et al., 2001).
    This tool produces a self-report; treat results as an input to coaching
    conversations rather than a final verdict.
  </footer>
</div>
