<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  let { children }: { children: Snippet } = $props();
</script>

<div class="max-w-5xl mx-auto px-4 py-6">
  <header class="mb-6 pb-4 border-b border-slate-200">
    <h1 class="text-2xl font-bold text-brand-700">Agile Checklist</h1>
    <p class="text-sm text-slate-600">
      Audit 57 concrete agile behaviours across Teams, Stakeholders, and
      Practices, and generate a coaching action plan.
    </p>
  </header>
  {@render children()}
  <footer class="mt-12 pt-4 border-t border-slate-200 text-xs text-slate-500">
    Companion form to the Agile Principles Assessment. This checklist
    measures observable behaviour; the principles assessment measures
    intent and belief. Treat both as inputs to coaching conversations.
  </footer>
</div>
