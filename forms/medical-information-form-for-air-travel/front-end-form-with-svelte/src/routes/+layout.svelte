<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  let { children }: { children: Snippet } = $props();
</script>

<div class="max-w-5xl mx-auto px-4 py-6">
  <header class="mb-6 pb-4 border-b border-slate-200">
    <h1 class="text-2xl font-bold text-brand-700">Medical Information Form for Air Travel (MEDIF)</h1>
    <p class="text-sm text-slate-600">
      Single-page, step-by-step wizard. Part 1 (passenger / agent) and Part 2 (attending physician)
      combined into one continuous form. Computes fitness-to-fly band and safety flags suitable for
      submission to an airline medical desk.
    </p>
  </header>
  {@render children()}
</div>
