<script lang="ts">
  import { formState } from '$stores/formState.svelte';
</script>

<section class="border rounded p-4" data-step="3">
  <h2 class="text-xl font-semibold mb-3">3. Participants</h2>
  <div class="grid grid-cols-2 gap-3">
    <label>DRI<input class="w-full border p-1" bind:value={formState.participants.dri}/></label>
    <label>Contributors<input class="w-full border p-1" bind:value={formState.participants.contributors}/></label>
    <label>Reviewers<input class="w-full border p-1" bind:value={formState.participants.reviewers}/></label>
    <label>Stakeholders<input class="w-full border p-1" bind:value={formState.participants.stakeholders}/></label>
  </div>
</section>
