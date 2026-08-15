<script lang="ts">
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import MetricRow from '#lib/components/ui/MetricRow.svelte';
  import { metricsForCategory } from '#lib/config/metrics.js';

  const metrics = metricsForCategory(9);
</script>

<Fieldset legend="Step 10 — Category 9 — Radiology Metrics (1 metric)">
  <p class="hint">Radiation volumes.</p>

  {#each metrics as metric (metric.id)}
    <MetricRow {metric} />
  {/each}
</Fieldset>
