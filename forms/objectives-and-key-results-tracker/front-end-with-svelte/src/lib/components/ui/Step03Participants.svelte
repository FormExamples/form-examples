<script lang="ts">
  import { formState } from '$stores/formState.svelte';
  const d = formState.data;
</script>

<section class="rounded-lg border border-base-300 bg-base-100 p-4" data-step="3">
  <h2 class="mb-3 text-xl font-semibold text-base-content">3. Participants</h2>
  <div class="grid grid-cols-2 gap-3">
    <label class="block text-sm text-base-content/80">DRI<input id="dri" class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" bind:value={d.participants.dri}/></label>
    <label class="block text-sm text-base-content/80">Contributors<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" bind:value={d.participants.contributors}/></label>
    <label class="block text-sm text-base-content/80">Reviewers<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" bind:value={d.participants.reviewers}/></label>
    <label class="block text-sm text-base-content/80">Stakeholders<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" bind:value={d.participants.stakeholders}/></label>
  </div>
</section>
