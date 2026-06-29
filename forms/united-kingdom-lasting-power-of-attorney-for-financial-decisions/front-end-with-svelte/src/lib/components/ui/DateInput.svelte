<script lang="ts">
  // DateInput — Lily Svelte headless contract (date-input).
  let {
    value = $bindable(''),
    id = undefined,
  }: {
    value: string;
    id?: string;
  } = $props();
</script>

<input
  type="date"
  {id}
  bind:value
  class="date-input"
/>
