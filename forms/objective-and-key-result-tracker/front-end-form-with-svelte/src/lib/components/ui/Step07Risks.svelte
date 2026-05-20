<script lang="ts">
  import { formState } from '$stores/formState.svelte';
</script>

<section class="border rounded p-4" data-step="7">
  <h2 class="text-xl font-semibold mb-3">7. Risks</h2>
  <div class="grid grid-cols-1 gap-3">
    <label>Known risks
      <textarea class="w-full border p-1" rows="3" bind:value={formState.risks.rk_known_risks}></textarea>
    </label>
    <label>Dependencies
      <textarea class="w-full border p-1" rows="3" bind:value={formState.risks.rk_dependencies}></textarea>
    </label>
    <label>Blockers
      <textarea class="w-full border p-1" rows="3" bind:value={formState.risks.rk_blockers}></textarea>
    </label>
    <label>Mitigation plans
      <textarea class="w-full border p-1" rows="3" bind:value={formState.risks.rk_mitigation_plans}></textarea>
    </label>
  </div>
</section>
