<script lang="ts">
  let { flagged }: { flagged: boolean } = $props();

  const label = $derived(flagged ? 'Yes' : 'No');
  const cls = $derived(
    flagged
      ? 'bg-red-100 text-red-800 border-red-400 animate-pulse'
      : 'bg-slate-100 text-slate-500 border-slate-300',
  );
</script>

<span
  class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold border {cls}"
  aria-label={`Never-event flagged: ${label}`}
>
  {label}
</span>
