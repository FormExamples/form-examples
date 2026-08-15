<script lang="ts">
  import type { AdditionalFlag, Maturity } from '#lib/engine/types.js';
  import { maturityColor, maturityLabel } from '#lib/engine/utils.js';

  let { flags, maturity }: { flags: AdditionalFlag[]; maturity: Maturity } = $props();

  const bannerClass = $derived(maturityColor(maturity));
  const bannerLabel = $derived(maturityLabel(maturity).toUpperCase());
</script>

<div class="border-l-4 {bannerClass} p-4 my-4 rounded">
  <p class="font-semibold mb-2">Composite maturity: {bannerLabel}</p>
  {#if flags.length > 0}
    <p class="text-sm mb-1">Operational flags:</p>
    <ul class="list-disc list-inside text-sm space-y-1">
      {#each flags as f (f.flagId)}
        <li>
          <span class="font-medium">[{f.priority.toUpperCase()}]</span>
          {f.description} <span class="opacity-80">— {f.suggestedAction}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="text-sm">No operational flags raised.</p>
  {/if}
</div>
