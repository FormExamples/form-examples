<script lang="ts">
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import MetricRow from '#lib/components/ui/MetricRow.svelte';
  import { metricsForCategory } from '#lib/config/metrics.js';

  const metrics = metricsForCategory(6);
</script>

<Fieldset legend="Step 7 — Category 6 — Outpatient Department (OPD) Metrics (9 metrics)">
  <p class="hint">New registrations, OPD statistics, staffing ratios, visit and appointment volumes by department and physician, new-visit rate, and walk-in rate.</p>

  {#each metrics as metric (metric.id)}
    <MetricRow {metric} />
  {/each}
</Fieldset>
