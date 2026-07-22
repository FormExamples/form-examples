<script lang="ts">
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import MetricRow from '$lib/components/ui/MetricRow.svelte';
  import { metricsForCategory } from '$lib/config/metrics.js';

  const metrics = metricsForCategory(10);
</script>

<Fieldset legend="Step 11 — Category 10 — Patient Flow / Waiting Times (2 metrics)">
  <p class="hint">OPD arrival times and clinic waiting time.</p>

  {#each metrics as metric (metric.id)}
    <MetricRow {metric} />
  {/each}
</Fieldset>
