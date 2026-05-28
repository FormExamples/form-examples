<script lang="ts">
  // StepCard — Lily Svelte headless contract (fieldset shape with step header).
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

<fieldset id="step-{step}" class="fieldset step-section">
  <legend class="fieldset-legend">
    <span class="hint">Step {step} of 11</span>
    <span>{title}</span>
  </legend>
  {#if description}
    <p class="hint">{description}</p>
  {/if}
  {@render children()}
</fieldset>
