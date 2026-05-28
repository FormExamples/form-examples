<script lang="ts">
  // YesNoField — Lily Svelte headless contract (radio-group / radio-input).
  import type { YesNo } from '$lib/engine/types.js';
  interface Props {
    label: string;
    value: YesNo;
    hint?: string;
    onchange?: () => void;
  }
  let { label, value = $bindable(), hint = '', onchange }: Props = $props();
  const name = `yn-${Math.random().toString(36).slice(2, 10)}`;
</script>

<fieldset class="field radio-group" role="radiogroup" aria-label={label}>
  <legend class="label">{label}</legend>
  <label class="radio-input">
    <input type="radio" {name} value="yes" bind:group={value} onchange={() => onchange?.()} />
    <span>Yes</span>
  </label>
  <label class="radio-input">
    <input type="radio" {name} value="no" bind:group={value} onchange={() => onchange?.()} />
    <span>No</span>
  </label>
  {#if hint}<span class="hint">{hint}</span>{/if}
</fieldset>
