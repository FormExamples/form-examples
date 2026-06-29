<script lang="ts">
  import type { AdditionalFlag, Maturity } from '$lib/engine/types.js';

  let { flags, maturity }: { flags: AdditionalFlag[]; maturity: Maturity } = $props();

  const banner = $derived.by(() => {
    switch (maturity) {
      case 'optimising':
        return { class: 'bg-success/10 border-success text-success', label: 'OPTIMISING' };
      case 'mature':
        return { class: 'bg-success/10 border-success text-success', label: 'MATURE' };
      case 'developing':
        return { class: 'bg-warning/10 border-warning text-warning', label: 'DEVELOPING' };
      case 'initial':
        return { class: 'bg-warning/10 border-warning text-warning', label: 'INITIAL' };
      case 'ad-hoc':
        return { class: 'bg-error/10 border-error text-error', label: 'AD-HOC' };
      default:
        return { class: 'bg-base-200 border-base-300 text-base-content/80', label: 'INSUFFICIENT DATA' };
    }
  });
</script>

<div class="border-l-4 {banner.class} p-4 my-4 rounded">
  <p class="font-semibold mb-2">Composite maturity: {banner.label}</p>
  {#if flags.length > 0}
    <p class="text-sm mb-1">Operational flags:</p>
    <ul class="list-disc list-inside text-sm space-y-1">
      {#each flags as f (f.flagId + (f.principleNumber ?? ''))}
        <li>
          <span class="font-medium">[{f.priority.toUpperCase()}]</span>
          {f.description} <span class="text-base-content/70">— {f.suggestedAction}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="text-sm">No operational flags raised.</p>
  {/if}
</div>
