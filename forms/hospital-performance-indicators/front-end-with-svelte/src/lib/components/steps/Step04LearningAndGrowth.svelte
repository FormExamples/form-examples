<script lang="ts">
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import IndicatorRow from '$lib/components/ui/IndicatorRow.svelte';
  import { indicatorsForCategory } from '$lib/config/indicators.js';

  const indicators = indicatorsForCategory(3);
</script>

<Fieldset legend="Step 4 — Perspective 3 — Learning and Growth Indicators (8 indicators)">
  <p class="hint">Staff satisfaction, training, and workforce-development indicators.</p>

  {#each indicators as indicator (indicator.id)}
    <IndicatorRow {indicator} />
  {/each}
</Fieldset>
