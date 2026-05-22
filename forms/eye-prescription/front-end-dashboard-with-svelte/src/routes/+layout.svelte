<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  let { children }: { children: Snippet } = $props();
</script>

<div class="max-w-[96rem] mx-auto px-6 py-6">
  <header class="mb-4 pb-4 border-b border-slate-200">
    <h1 class="text-2xl font-bold text-brand-700">Eye Prescription — Dashboard</h1>
    <p class="text-sm text-slate-600">
      Practice-level review of issued spectacle prescriptions.
    </p>
  </header>
  {@render children()}
</div>
