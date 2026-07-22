<script lang="ts">
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import IndicatorRow from '$lib/components/ui/IndicatorRow.svelte';
  import { indicatorsForCategory } from '$lib/config/indicators.js';

  const indicators = indicatorsForCategory(1);
</script>

<Fieldset legend="Step 2 — Perspective 1 — Finance Indicators (9 indicators)">
  <p class="hint">Revenue, cost, and expenditure indicators for the reporting period.</p>

  {#each indicators as indicator (indicator.id)}
    <IndicatorRow {indicator} />
  {/each}
</Fieldset>
