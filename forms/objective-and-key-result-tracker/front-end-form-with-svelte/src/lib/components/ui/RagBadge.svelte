<script lang="ts">
  let { band }: { band: 'green' | 'amber' | 'red' | null } = $props();
  const cls = { green: 'bg-green-700', amber: 'bg-amber-600', red: 'bg-red-700' };
</script>

{#if band}
  <span class="inline-block text-white font-bold px-3 py-1 rounded {cls[band]}">{band.toUpperCase()}</span>
{:else}
  <span class="inline-block text-gray-500">(not computed)</span>
{/if}
