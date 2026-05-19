<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  let { children }: { children: Snippet } = $props();
</script>

<div class="min-h-screen bg-slate-50">
  <header class="border-b-4 border-nhs-warm-yellow bg-nhs-blue text-white shadow">
    <div class="mx-auto max-w-7xl px-5 py-4">
      <h1 class="text-xl font-bold">
        UK Statement of Fitness for Work — Dashboard
      </h1>
      <p class="text-sm text-blue-100">
        Review Med 3 fit notes by recommendation, fitness category, adaptation
        intensity, period compliance, and safety flags.
      </p>
    </div>
  </header>

  <main class="mx-auto max-w-7xl px-5 py-6">
    {@render children()}
  </main>
</div>
