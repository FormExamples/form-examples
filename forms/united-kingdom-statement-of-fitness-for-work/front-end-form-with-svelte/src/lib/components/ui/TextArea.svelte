<script lang="ts">
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
  class="w-full border rounded px-2 py-1 text-sm leading-snug"
  bind:value
></textarea>
