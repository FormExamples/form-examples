<script lang="ts">
  // TextArea — Lily Svelte headless contract.
  let {
    label,
    name,
    value = $bindable(''),
    placeholder = '',
    rows = 3
  }: {
    label: string;
    name: string;
    value: string;
    placeholder?: string;
    rows?: number;
  } = $props();
</script>

<div class="field">
  <label class="label" for={name}>{label}</label>
  <textarea
    id={name}
    {name}
    {placeholder}
    {rows}
    class="text-area-input"
    bind:value
  ></textarea>
</div>
