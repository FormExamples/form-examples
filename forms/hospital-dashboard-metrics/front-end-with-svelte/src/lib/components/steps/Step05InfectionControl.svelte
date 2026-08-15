<script lang="ts">
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import MetricRow from '#lib/components/ui/MetricRow.svelte';
  import { metricsForCategory } from '#lib/config/metrics.js';

  const metrics = metricsForCategory(4);
</script>

<Fieldset legend="Step 5 — Category 4 — Infection Control Metrics (5 metrics)">
  <p class="hint">Healthcare-associated infection rates: HAI, CAUTI, VAP, SSI, and CLABSI.</p>

  {#each metrics as metric (metric.id)}
    <MetricRow {metric} />
  {/each}
</Fieldset>
