<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  let { children }: { children: Snippet } = $props();
</script>

<div class="max-w-6xl mx-auto px-4 py-6">
  <header class="mb-6 pb-4 border-b border-slate-200">
    <h1 class="text-2xl font-bold text-brand-700">Architecture Decision Records — Register</h1>
    <p class="text-sm text-slate-600">
      Read-only register of ADRs captured via the Tyree &amp; Akerman wizard.
    </p>
  </header>
  {@render children()}
</div>
