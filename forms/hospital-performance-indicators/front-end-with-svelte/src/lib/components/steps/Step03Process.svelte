<script lang="ts">
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import IndicatorRow from '$lib/components/ui/IndicatorRow.svelte';
  import { indicatorsForCategory } from '$lib/config/indicators.js';

  const indicators = indicatorsForCategory(2);
</script>

<Fieldset legend="Step 3 — Perspective 2 — Process Indicators (28 indicators)">
  <p class="hint">
    Clinical process, safety, and operational-flow indicators — the largest
    perspective in the Balanced Scorecard.
  </p>

  {#each indicators as indicator (indicator.id)}
    <IndicatorRow {indicator} />
  {/each}
</Fieldset>
