<script lang="ts">
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import MetricRow from '$lib/components/ui/MetricRow.svelte';
  import { metricsForCategory } from '$lib/config/metrics.js';

  const metrics = metricsForCategory(14);
</script>

<Fieldset legend="Step 15 — Category 14 — Facilities &amp; Biomedical Engineering Metrics (6 metrics)">
  <p class="hint">Work orders, PPM completion rate, corrective-maintenance duration, equipment breakdowns, equipment cards, and supplies/equipment variances.</p>

  {#each metrics as metric (metric.id)}
    <MetricRow {metric} />
  {/each}
</Fieldset>
