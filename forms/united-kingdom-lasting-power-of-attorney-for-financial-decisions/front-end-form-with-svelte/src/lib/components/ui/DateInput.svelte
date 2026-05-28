<script lang="ts">
  // DateInput — Lily Svelte headless contract (date-input).
  let {
    value = $bindable(''),
  }: {
    value: string;
  } = $props();
</script>

<input
  type="date"
  bind:value
  class="date-input"
/>
