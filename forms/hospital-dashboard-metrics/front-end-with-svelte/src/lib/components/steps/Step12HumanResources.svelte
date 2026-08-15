<script lang="ts">
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import MetricRow from '#lib/components/ui/MetricRow.svelte';
  import { metricsForCategory } from '#lib/config/metrics.js';

  const metrics = metricsForCategory(11);
</script>

<Fieldset legend="Step 12 — Category 11 — Human Resources Metrics (3 metrics)">
  <p class="hint">Staff satisfaction survey, vacancy rate, and exit survey.</p>

  {#each metrics as metric (metric.id)}
    <MetricRow {metric} />
  {/each}
</Fieldset>
