<script lang="ts">
  import type { Snippet } from 'svelte';
  let {
    step,
    title,
    description = '',
    children,
  }: {
    step: number;
    title: string;
    description?: string;
    children: Snippet;
  } = $props();
</script>

<section id="step-{step}" class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 scroll-mt-20">
  <header class="mb-4 pb-3 border-b border-slate-200">
    <p class="text-xs font-semibold uppercase tracking-wide text-brand-600">Step {step} of 11</p>
    <h2 class="text-xl font-semibold text-slate-900 mt-1">{title}</h2>
    {#if description}
      <p class="text-sm text-slate-600 mt-1">{description}</p>
    {/if}
  </header>
  {@render children()}
</section>
