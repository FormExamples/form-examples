<script lang="ts">
  import { formState } from '$stores/formState.svelte';
  const d = formState.data;
</script>

<section class="rounded-lg border border-base-300 bg-base-100 p-4" data-step="8">
  <h2 class="mb-3 text-xl font-semibold text-base-content">8. Check-in</h2>
  <div class="grid grid-cols-1 gap-3">
    <label class="block text-sm text-base-content/80">Narrative
      <textarea class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" rows="3" bind:value={d.checkIn.narrative}></textarea>
    </label>
    <label class="block text-sm text-base-content/80">Since last changes
      <textarea class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" rows="3" bind:value={d.checkIn.since_last_changes}></textarea>
    </label>
    <label class="block text-sm text-base-content/80">Blockers
      <textarea class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" rows="3" bind:value={d.checkIn.blockers}></textarea>
    </label>
    <label class="block text-sm text-base-content/80">Asks
      <textarea class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" rows="3" bind:value={d.checkIn.asks}></textarea>
    </label>
  </div>
</section>
