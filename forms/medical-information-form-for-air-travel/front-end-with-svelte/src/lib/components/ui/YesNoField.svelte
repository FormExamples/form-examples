<script lang="ts">
  // YesNoField — Lily Svelte headless contract.
  // Emits: <div class="field"><label class="label">...</label>
  //        <select class="select"></select></div>.
  import type { YesNo } from '#lib/engine/types.js';
  let {
    label,
    value = $bindable(),
    hint = '',
    required = false,
  }: { label: string; value: YesNo; hint?: string; required?: boolean } = $props();
</script>

<div class="field" data-required={required || undefined}>
  <label class="label" data-required={required || undefined}>
    <span>{label}</span>
    <select class="select" aria-label={label} bind:value {required}>
      <option value="">—</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </select>
  </label>
  {#if hint}<p class="hint">{hint}</p>{/if}
</div>
