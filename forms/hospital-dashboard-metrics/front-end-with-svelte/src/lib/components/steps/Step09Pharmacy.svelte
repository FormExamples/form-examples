<script lang="ts">
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import MetricRow from '$lib/components/ui/MetricRow.svelte';
  import { metricsForCategory } from '$lib/config/metrics.js';

  const metrics = metricsForCategory(8);
</script>

<Fieldset legend="Step 9 — Category 8 — Pharmacy Metrics (5 metrics)">
  <p class="hint">Dispensing quantities and cost, medication errors, emergency medication availability, and expired-item cost ratio.</p>

  {#each metrics as metric (metric.id)}
    <MetricRow {metric} />
  {/each}
</Fieldset>
