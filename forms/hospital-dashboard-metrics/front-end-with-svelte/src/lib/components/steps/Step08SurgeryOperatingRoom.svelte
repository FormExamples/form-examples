<script lang="ts">
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import MetricRow from '$lib/components/ui/MetricRow.svelte';
  import { metricsForCategory } from '$lib/config/metrics.js';

  const metrics = metricsForCategory(7);
</script>

<Fieldset legend="Step 8 — Category 7 — Surgery / Operating Room Metrics (6 metrics)">
  <p class="hint">Surgical volumes, elective-surgery percentage, OR cancellations, VTE prophylaxis compliance, returns to OR, and pre-surgical antibiotic timing.</p>

  {#each metrics as metric (metric.id)}
    <MetricRow {metric} />
  {/each}
</Fieldset>
