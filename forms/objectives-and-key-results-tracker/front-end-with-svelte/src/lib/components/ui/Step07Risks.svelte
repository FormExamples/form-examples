<script lang="ts">
  import { formState } from '$stores/formState.svelte';
  const d = formState.data;
</script>

<section class="rounded-lg border border-base-300 bg-base-100 p-4" data-step="7">
  <h2 class="mb-3 text-xl font-semibold text-base-content">7. Risks</h2>
  <div class="grid grid-cols-1 gap-3">
    <label class="block text-sm text-base-content/80">Known risks
      <textarea class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" rows="3" bind:value={d.risks.rk_known_risks}></textarea>
    </label>
    <label class="block text-sm text-base-content/80">Dependencies
      <textarea class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" rows="3" bind:value={d.risks.rk_dependencies}></textarea>
    </label>
    <label class="block text-sm text-base-content/80">Blockers
      <textarea class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" rows="3" bind:value={d.risks.rk_blockers}></textarea>
    </label>
    <label class="block text-sm text-base-content/80">Mitigation plans
      <textarea class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" rows="3" bind:value={d.risks.rk_mitigation_plans}></textarea>
    </label>
  </div>
</section>
