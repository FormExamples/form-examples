<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  let { children }: { children: Snippet } = $props();
</script>

<div class="max-w-[110rem] mx-auto px-6 py-6">
  <header class="mb-4 pb-4 border-b border-slate-200">
    <h1 class="text-2xl font-bold text-brand-700">Operation Note — Theatre Review Dashboard</h1>
    <p class="text-sm text-slate-600">
      Submitted op notes for review by theatre coordinators and clinical governance leads.
      Composite operative risk grade, Clavien–Dindo, safety flags, never-event candidates,
      and sign-off status at a glance.
    </p>
  </header>
  {@render children()}
</div>
