<script lang="ts">
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import MetricRow from '$lib/components/ui/MetricRow.svelte';
  import { metricsForCategory } from '$lib/config/metrics.js';

  const metrics = metricsForCategory(2);
</script>

<Fieldset legend="Step 3 — Category 2 — Inpatient / Ward Metrics (11 metrics)">
  <p class="hint">Length of stay, bed occupancy/turnover, mortality, readmission, discharge summary completeness, medical records, patient safety goals, unplanned transfers, and staffing ratios.</p>

  {#each metrics as metric (metric.id)}
    <MetricRow {metric} />
  {/each}
</Fieldset>
