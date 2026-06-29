<script lang="ts">
  let { band }: { band: 'green' | 'amber' | 'red' | null } = $props();
  const cls: Record<'green' | 'amber' | 'red', string> = {
    green: 'bg-success text-success-content border-success',
    amber: 'bg-warning text-warning-content border-warning',
    red: 'bg-error text-error-content border-error'
  };
</script>

{#if band}
  <span class="inline-block rounded border px-3 py-1 font-bold {cls[band]}">{band.toUpperCase()}</span>
{:else}
  <span class="inline-block text-base-content/60">(not computed)</span>
{/if}
