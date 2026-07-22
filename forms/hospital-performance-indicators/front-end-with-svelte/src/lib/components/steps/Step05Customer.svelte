<script lang="ts">
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import IndicatorRow from '$lib/components/ui/IndicatorRow.svelte';
  import { indicatorsForCategory } from '$lib/config/indicators.js';

  const indicators = indicatorsForCategory(4);
</script>

<Fieldset legend="Step 5 — Perspective 4 — Customer Indicators (5 indicators)">
  <p class="hint">Patient and stakeholder satisfaction indicators.</p>

  {#each indicators as indicator (indicator.id)}
    <IndicatorRow {indicator} />
  {/each}
</Fieldset>
