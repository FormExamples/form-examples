<script lang="ts">
  import { formState } from '$stores/formState.svelte';
</script>

<section class="border rounded p-4" data-step="6">
  <h2 class="text-xl font-semibold mb-3">6. Initiatives</h2>
  <div class="grid grid-cols-1 gap-3">
    <label>Initiatives
      <textarea class="w-full border p-1" rows="3" bind:value={formState.initiatives.in_initiatives}></textarea>
    </label>
    <label>Supporting links
      <textarea class="w-full border p-1" rows="3" bind:value={formState.initiatives.in_supporting_links}></textarea>
    </label>
  </div>
</section>
