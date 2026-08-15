<script lang="ts">
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import MetricRow from '#lib/components/ui/MetricRow.svelte';
  import { metricsForCategory } from '#lib/config/metrics.js';

  const metrics = metricsForCategory(13);
</script>

<Fieldset legend="Step 14 — Category 13 — Occurrence Variance Report (OVR) Metrics (3 metrics)">
  <p class="hint">In-hospital OVR by severity and type, and responses to OVR.</p>

  {#each metrics as metric (metric.id)}
    <MetricRow {metric} />
  {/each}
</Fieldset>
