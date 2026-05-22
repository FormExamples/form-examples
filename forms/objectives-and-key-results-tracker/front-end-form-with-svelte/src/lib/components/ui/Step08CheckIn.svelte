<script lang="ts">
  import { formState } from '$stores/formState.svelte';
</script>

<section class="border rounded p-4" data-step="8">
  <h2 class="text-xl font-semibold mb-3">8. Check-in</h2>
  <div class="grid grid-cols-1 gap-3">
    <label>Narrative
      <textarea class="w-full border p-1" rows="3" bind:value={formState.checkIn.narrative}></textarea>
    </label>
    <label>Since last changes
      <textarea class="w-full border p-1" rows="3" bind:value={formState.checkIn.since_last_changes}></textarea>
    </label>
    <label>Blockers
      <textarea class="w-full border p-1" rows="3" bind:value={formState.checkIn.blockers}></textarea>
    </label>
    <label>Asks
      <textarea class="w-full border p-1" rows="3" bind:value={formState.checkIn.asks}></textarea>
    </label>
  </div>
</section>
