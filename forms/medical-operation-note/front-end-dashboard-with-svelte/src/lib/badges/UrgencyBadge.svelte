<script lang="ts">
  import type { NcepodUrgency } from '$lib/sample-data.js';

  let { urgency }: { urgency: NcepodUrgency } = $props();

  const LABEL: Record<NcepodUrgency, string> = {
    elective: 'Elective',
    expedited: 'Expedited',
    urgent: 'Urgent',
    immediate: 'Immediate',
  };

  const STYLE: Record<NcepodUrgency, string> = {
    elective: 'bg-slate-100 text-slate-700 border-slate-300',
    expedited: 'bg-sky-100 text-sky-700 border-sky-300',
    urgent: 'bg-amber-100 text-amber-800 border-amber-300',
    immediate: 'bg-red-100 text-red-800 border-red-400',
  };
</script>

<span
  class="inline-block px-2 py-0.5 rounded-full text-xs font-medium border {STYLE[urgency]}"
  aria-label={`NCEPOD urgency: ${LABEL[urgency]}`}
>
  {LABEL[urgency]}
</span>
