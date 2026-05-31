<script lang="ts">
  let { signedAt }: { signedAt: string } = $props();

  const isSigned = $derived(signedAt !== '');
  const label = $derived(isSigned ? 'Signed' : 'Unsigned');
  const cls = $derived(
    isSigned
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
      : 'bg-slate-100 text-slate-600 border-slate-300',
  );
</script>

<span
  class="inline-block px-2 py-0.5 rounded-full text-xs font-medium border {cls}"
  aria-label={`Sign-off status: ${label}`}
>
  {label}
</span>
