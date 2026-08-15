<script lang="ts">
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import MetricRow from '#lib/components/ui/MetricRow.svelte';
  import { metricsForCategory } from '#lib/config/metrics.js';

  const metrics = metricsForCategory(1);
</script>

<Fieldset legend="Step 2 — Category 1 — Antibiotics, Narcotics &amp; Culture Monitoring (3 metrics)">
  <p class="hint">Antibiotics issuing, culture results, and narcotics issuing.</p>

  {#each metrics as metric (metric.id)}
    <MetricRow {metric} />
  {/each}
</Fieldset>
