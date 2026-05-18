<script lang="ts">
  import type { AdditionalFlag, Maturity } from '$lib/engine/types.js';

  let { flags, maturity }: { flags: AdditionalFlag[]; maturity: Maturity } = $props();

  const banner = $derived.by(() => {
    switch (maturity) {
      case 'optimising':
        return { class: 'bg-emerald-100 border-emerald-600 text-emerald-900', label: 'OPTIMISING' };
      case 'mature':
        return { class: 'bg-green-100 border-green-600 text-green-900', label: 'MATURE' };
      case 'developing':
        return { class: 'bg-yellow-100 border-yellow-600 text-yellow-900', label: 'DEVELOPING' };
      case 'initial':
        return { class: 'bg-orange-100 border-orange-600 text-orange-900', label: 'INITIAL' };
      case 'ad-hoc':
        return { class: 'bg-red-100 border-red-600 text-red-900', label: 'AD-HOC' };
      default:
        return { class: 'bg-slate-100 border-slate-500 text-slate-800', label: 'INSUFFICIENT DATA' };
    }
  });
</script>

<div class="border-l-4 {banner.class} p-4 my-4 rounded">
  <p class="font-semibold mb-2">Composite maturity: {banner.label}</p>
  {#if flags.length > 0}
    <p class="text-sm mb-1">Operational flags:</p>
    <ul class="list-disc list-inside text-sm space-y-1">
      {#each flags as f (f.flagId)}
        <li>
          <span class="font-medium">[{f.priority.toUpperCase()}]</span>
          {f.description} <span class="text-slate-700">— {f.suggestedAction}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="text-sm">No operational flags raised.</p>
  {/if}
</div>
