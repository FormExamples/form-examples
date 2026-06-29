<script lang="ts">
  import { formState } from '$stores/formState.svelte';
  const d = formState.data;
</script>

<section class="rounded-lg border border-base-300 bg-base-100 p-4" data-step="2">
  <h2 class="mb-3 text-xl font-semibold text-base-content">2. Objective</h2>
  <div class="grid grid-cols-1 gap-3">
    <label class="block text-sm text-base-content/80">Title<input id="objTitle" class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" bind:value={d.objective.obj_title}/></label>
    <label class="block text-sm text-base-content/80">Long description
      <textarea class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" rows="3" bind:value={d.objective.obj_long_description}></textarea>
    </label>
    <label class="block text-sm text-base-content/80">Strategic theme<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" bind:value={d.objective.strategic_theme}/></label>
    <label class="block text-sm text-base-content/80">Parent objective ID<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" bind:value={d.objective.parent_objective_id}/></label>
  </div>
</section>
