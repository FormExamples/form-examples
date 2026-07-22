<script lang="ts">
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import MetricRow from '$lib/components/ui/MetricRow.svelte';
  import { metricsForCategory } from '$lib/config/metrics.js';

  const metrics = metricsForCategory(5);
</script>

<Fieldset legend="Step 6 — Category 5 — Blood Bank Metrics (3 metrics)">
  <p class="hint">Turnaround time, blood utilization, and blood wastage.</p>

  {#each metrics as metric (metric.id)}
    <MetricRow {metric} />
  {/each}
</Fieldset>
