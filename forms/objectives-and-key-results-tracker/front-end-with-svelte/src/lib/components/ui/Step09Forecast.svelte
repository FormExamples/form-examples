<script lang="ts">
  import { formState } from '$stores/formState.svelte';
  const d = formState.data;
</script>

<section class="rounded-lg border border-base-300 bg-base-100 p-4" data-step="9">
  <h2 class="mb-3 text-xl font-semibold text-base-content">9. Forecast</h2>
  <div class="grid grid-cols-1 gap-3">
    <label class="block text-sm text-base-content/80">Expected end state
      <textarea class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" rows="3" bind:value={d.forecast.fc_expected_end_state}></textarea>
    </label>
    <label class="block text-sm text-base-content/80">Residual risk
      <textarea class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" rows="3" bind:value={d.forecast.fc_residual_risk}></textarea>
    </label>
  </div>
</section>
