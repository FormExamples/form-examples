<script lang="ts">
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import MetricRow from '#lib/components/ui/MetricRow.svelte';
  import { metricsForCategory } from '#lib/config/metrics.js';

  const metrics = metricsForCategory(12);
</script>

<Fieldset legend="Step 13 — Category 12 — Patient Experience Metrics (2 metrics)">
  <p class="hint">Patient satisfaction survey and patient complaints register.</p>

  {#each metrics as metric (metric.id)}
    <MetricRow {metric} />
  {/each}
</Fieldset>
