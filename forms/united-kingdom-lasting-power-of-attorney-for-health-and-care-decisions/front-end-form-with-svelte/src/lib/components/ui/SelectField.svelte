<script lang="ts">
  // SelectField — Lily Svelte headless contract (select).
  interface Option {
    value: string;
    label: string;
  }
  interface Props {
    label: string;
    value: string;
    options: Option[];
    hint?: string;
    required?: boolean;
    onchange?: () => void;
  }
  let {
    label,
    value = $bindable(),
    options,
    hint = '',
    required = false,
    onchange,
  }: Props = $props();

  const id = `s-${Math.random().toString(36).slice(2, 10)}`;
</script>

<div class="field">
  <label for={id} class="label" data-required={required || undefined}>
    {label}
  </label>
  <select
    {id}
    bind:value
    onchange={() => onchange?.()}
    class="select"
  >
    <option value="">— select —</option>
    {#each options as opt (opt.value)}
      <option value={opt.value}>{opt.label}</option>
    {/each}
  </select>
  {#if hint}<span class="hint">{hint}</span>{/if}
</div>
