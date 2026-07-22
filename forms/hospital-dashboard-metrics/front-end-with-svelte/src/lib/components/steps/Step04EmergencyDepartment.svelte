<script lang="ts">
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import MetricRow from '$lib/components/ui/MetricRow.svelte';
  import { metricsForCategory } from '$lib/config/metrics.js';

  const metrics = metricsForCategory(3);
</script>

<Fieldset legend="Step 4 — Category 3 — Emergency Department Metrics (8 metrics)">
  <p class="hint">Daily case volume, ECG turnaround, 4-hour treatment rate, consultant arrival times, ER returns, CPR success rate, and essential-supply availability.</p>

  {#each metrics as metric (metric.id)}
    <MetricRow {metric} />
  {/each}
</Fieldset>
