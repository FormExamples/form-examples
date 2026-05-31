<script lang="ts">
  import type { CompositeRisk } from '$lib/sample-data.js';

  let { risk }: { risk: CompositeRisk } = $props();

  const LABEL: Record<CompositeRisk, string> = {
    routine: 'Routine',
    complicated: 'Complicated',
    'high-risk': 'High-risk',
    critical: 'Critical',
  };

  const STYLE: Record<CompositeRisk, string> = {
    routine: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    complicated: 'bg-amber-100 text-amber-800 border-amber-300',
    'high-risk': 'bg-orange-100 text-orange-800 border-orange-300',
    critical: 'bg-red-100 text-red-800 border-red-400',
  };
</script>

<span
  class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold border {STYLE[risk]}"
  aria-label={`Composite operative risk: ${LABEL[risk]}`}
>
  {LABEL[risk]}
</span>
