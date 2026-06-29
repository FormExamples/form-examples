<script lang="ts">
  import { formState } from '$stores/formState.svelte';
  const d = formState.data;
</script>

<section class="rounded-lg border border-base-300 bg-base-100 p-4" data-step="6">
  <h2 class="mb-3 text-xl font-semibold text-base-content">6. Initiatives</h2>
  <div class="grid grid-cols-1 gap-3">
    <label class="block text-sm text-base-content/80">Initiatives
      <textarea class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" rows="3" bind:value={d.initiatives.in_initiatives}></textarea>
    </label>
    <label class="block text-sm text-base-content/80">Supporting links
      <textarea class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" rows="3" bind:value={d.initiatives.in_supporting_links}></textarea>
    </label>
  </div>
</section>
