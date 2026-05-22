<script lang="ts">
  let {
    value = $bindable(''),
  }: {
    value: string;
  } = $props();
</script>

<input
  type="date"
  bind:value
  class="w-full border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-brand-500"
/>
