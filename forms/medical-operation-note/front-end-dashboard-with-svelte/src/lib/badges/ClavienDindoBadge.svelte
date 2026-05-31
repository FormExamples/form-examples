<script lang="ts">
  import type { ClavienDindo } from '$lib/sample-data.js';

  let { grade }: { grade: ClavienDindo } = $props();

  // Clavien–Dindo escalates 0 → V; colour-code in line with composite risk.
  const STYLE: Record<ClavienDindo, string> = {
    '0': 'bg-emerald-50 text-emerald-700 border-emerald-300',
    I: 'bg-amber-50 text-amber-700 border-amber-300',
    II: 'bg-amber-100 text-amber-800 border-amber-300',
    IIIa: 'bg-orange-100 text-orange-800 border-orange-300',
    IIIb: 'bg-orange-200 text-orange-900 border-orange-400',
    IVa: 'bg-red-100 text-red-800 border-red-400',
    IVb: 'bg-red-200 text-red-900 border-red-500',
    V: 'bg-red-300 text-red-950 border-red-600',
  };
</script>

<span
  class="inline-block px-1.5 py-0.5 rounded text-xs font-mono font-semibold border {STYLE[grade]}"
  aria-label={`Clavien–Dindo grade ${grade}`}
>
  {grade}
</span>
