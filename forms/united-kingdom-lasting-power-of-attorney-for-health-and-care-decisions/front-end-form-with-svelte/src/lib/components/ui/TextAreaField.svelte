<script lang="ts">
  // TextAreaField — Lily Svelte headless contract (text-area-input).
  interface Props {
    label: string;
    value: string;
    rows?: number;
    placeholder?: string;
    hint?: string;
    onchange?: () => void;
  }
  let {
    label,
    value = $bindable(),
    rows = 4,
    placeholder = '',
    hint = '',
    onchange,
  }: Props = $props();
  const id = `t-${Math.random().toString(36).slice(2, 10)}`;
</script>

<div class="field">
  <label for={id} class="label">{label}</label>
  <textarea
    {id}
    {rows}
    {placeholder}
    bind:value
    oninput={() => onchange?.()}
    class="text-area-input"
  ></textarea>
  {#if hint}<span class="hint">{hint}</span>{/if}
</div>
