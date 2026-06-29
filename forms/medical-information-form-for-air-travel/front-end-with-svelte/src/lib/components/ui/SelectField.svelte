<script lang="ts">
  // SelectField — Lily Svelte headless contract.
  // Emits: <div class="field"><label class="label">...</label>
  //        <select class="select">...</select></div>.
  let {
    label,
    value = $bindable(),
    options,
    hint = '',
    required = false,
  }: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    hint?: string;
    required?: boolean;
  } = $props();
</script>

<div class="field" data-required={required || undefined}>
  <label class="label" data-required={required || undefined}>
    <span>{label}</span>
    <select class="select" aria-label={label} bind:value {required}>
      <option value="">—</option>
      {#each options as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </select>
  </label>
  {#if hint}<p class="hint">{hint}</p>{/if}
</div>
