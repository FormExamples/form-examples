<script lang="ts">
  // TextareaInput — Lily Svelte headless contract (text-area-input).
  let {
    value = $bindable(''),
    rows = 4,
    maxlength = 2000,
    placeholder = '',
  }: {
    value: string;
    rows?: number;
    maxlength?: number;
    placeholder?: string;
  } = $props();
</script>

<textarea
  {rows}
  {maxlength}
  {placeholder}
  bind:value
  class="text-area-input"
></textarea>
<span class="hint">{value.length} / {maxlength}</span>
