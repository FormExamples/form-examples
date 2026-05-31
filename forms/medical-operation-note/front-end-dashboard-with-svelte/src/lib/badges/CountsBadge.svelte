<script lang="ts">
  let { agreed }: { agreed: boolean } = $props();

  const label = $derived(agreed ? 'OK' : 'Discrepant');
  const cls = $derived(
    agreed
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
      : 'bg-red-100 text-red-800 border-red-400',
  );
</script>

<span
  class="inline-block px-1.5 py-0.5 rounded text-xs font-mono font-semibold border {cls}"
  aria-label={`Swab/needle/instrument counts: ${label}`}
>
  {label}
</span>
