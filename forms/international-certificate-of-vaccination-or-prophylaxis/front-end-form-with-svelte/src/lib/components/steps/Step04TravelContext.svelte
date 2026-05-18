<script lang="ts">
  import { certificateStore } from '$lib/stores/certificate.svelte';
  const c = $derived(certificateStore.data);
</script>

<div class="space-y-3">
  <label class="block">Destination countries (space-separated alpha-3)
    <input class="border rounded w-full p-2" bind:value={c.destinationCountriesAsIso31661Alpha3} />
  </label>
  <label class="block">Planned arrival date
    <input type="date" class="border rounded w-full p-2" bind:value={c.plannedArrivalDate} />
  </label>
  <label class="block">Purpose of travel
    <select class="border rounded w-full p-2" bind:value={c.purposeOfTravel}>
      <option value="">Select…</option>
      <option>tourism</option><option>business</option>
      <option>study</option><option>employment</option>
      <option>humanitarian</option><option>military</option>
      <option>family</option><option>medical</option>
      <option>other</option>
    </select>
  </label>
  <label class="block">Declared pregnancy?
    <select class="border rounded w-full p-2" bind:value={c.declaredPregnancy}>
      <option value="">No</option><option value="yes">Yes</option>
    </select>
  </label>
  <label class="block">Declared breastfeeding?
    <select class="border rounded w-full p-2" bind:value={c.declaredBreastfeeding}>
      <option value="">No</option><option value="yes">Yes</option>
    </select>
  </label>
  <label class="block">Declared immunosuppression?
    <select class="border rounded w-full p-2" bind:value={c.declaredImmunosuppression}>
      <option value="">No</option><option value="yes">Yes</option>
    </select>
  </label>
</div>
