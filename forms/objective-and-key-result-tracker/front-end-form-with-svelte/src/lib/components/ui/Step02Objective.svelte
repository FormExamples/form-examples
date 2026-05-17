<script lang="ts">
  import { formState } from '$stores/formState.svelte';
</script>

<section class="border rounded p-4" data-step="2">
  <h2 class="text-xl font-semibold mb-3">2. Objective</h2>
  <div class="grid grid-cols-1 gap-3">
    <label>Title<input class="w-full border p-1" bind:value={formState.objective.obj_title}/></label>
    <label>Long description
      <textarea class="w-full border p-1" rows="3" bind:value={formState.objective.obj_long_description}></textarea>
    </label>
    <label>Strategic theme<input class="w-full border p-1" bind:value={formState.objective.strategic_theme}/></label>
    <label>Parent objective ID<input class="w-full border p-1" bind:value={formState.objective.parent_objective_id}/></label>
  </div>
</section>
