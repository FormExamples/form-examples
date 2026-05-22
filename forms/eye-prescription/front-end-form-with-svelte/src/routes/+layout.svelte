<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  let { children }: { children: Snippet } = $props();
</script>

<div class="max-w-5xl mx-auto px-4 py-6">
  <header class="mb-6 pb-4 border-b border-slate-200">
    <h1 class="text-2xl font-bold text-brand-700">Eye Prescription</h1>
    <p class="text-sm text-slate-600">
      UK GOC-aligned spectacle prescription with refractive classification, complexity grade, and safety flags.
    </p>
  </header>
  {@render children()}
</div>
