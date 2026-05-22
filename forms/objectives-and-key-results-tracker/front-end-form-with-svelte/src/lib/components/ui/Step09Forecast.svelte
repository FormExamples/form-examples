<script lang="ts">
  import { formState } from '$stores/formState.svelte';
</script>

<section class="border rounded p-4" data-step="9">
  <h2 class="text-xl font-semibold mb-3">9. Forecast</h2>
  <div class="grid grid-cols-1 gap-3">
    <label>Expected end state
      <textarea class="w-full border p-1" rows="3" bind:value={formState.forecast.fc_expected_end_state}></textarea>
    </label>
    <label>Residual risk
      <textarea class="w-full border p-1" rows="3" bind:value={formState.forecast.fc_residual_risk}></textarea>
    </label>
  </div>
</section>
