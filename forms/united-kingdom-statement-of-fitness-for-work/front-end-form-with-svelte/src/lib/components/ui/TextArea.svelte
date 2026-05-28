<script lang="ts">
  // TextArea — Lily Svelte headless contract.
  let {
    id,
    name,
    rows = 4,
    placeholder = '',
    value = $bindable(),
  }: {
    id: string;
    name: string;
    rows?: number;
    placeholder?: string;
    value: string;
  } = $props();
</script>

<textarea
  {id}
  {name}
  {rows}
  {placeholder}
  class="text-area-input"
  bind:value
></textarea>
