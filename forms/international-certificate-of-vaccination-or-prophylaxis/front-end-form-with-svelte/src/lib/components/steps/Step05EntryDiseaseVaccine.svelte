<script lang="ts">
  import { certificateStore } from '$lib/stores/certificate.svelte';
  const e = $derived(certificateStore.data.entries[0]);
</script>

<div class="space-y-3">
  <label class="block">Disease
    <select class="border rounded w-full p-2" bind:value={e.disease}>
      <option value="">Select…</option>
      <option value="yellow-fever">yellow-fever</option>
      <option value="polio">polio</option>
      <option value="smallpox">smallpox</option>
      <option value="cholera">cholera</option>
      <option value="meningococcal">meningococcal</option>
      <option value="covid-19">covid-19</option>
      <option value="other">other</option>
    </select>
  </label>
  <label class="block">Vaccine name
    <input class="border rounded w-full p-2" bind:value={e.vaccineOrProphylaxisName} />
  </label>
  <label class="block">Manufacturer
    <input class="border rounded w-full p-2" bind:value={e.manufacturer} />
  </label>
  <label class="block">Batch number
    <input class="border rounded w-full p-2" bind:value={e.batchNumber} />
  </label>
  <label class="block">Route
    <select class="border rounded w-full p-2" bind:value={e.route}>
      <option value="">Select…</option>
      <option>intramuscular</option><option>subcutaneous</option>
      <option>intradermal</option><option>oral</option>
      <option>intranasal</option><option>other</option>
    </select>
  </label>
  <label class="block">Anatomical site
    <select class="border rounded w-full p-2" bind:value={e.anatomicalSite}>
      <option value="">Select…</option>
      <option value="left-deltoid">left-deltoid</option>
      <option value="right-deltoid">right-deltoid</option>
      <option value="left-thigh">left-thigh</option>
      <option value="right-thigh">right-thigh</option>
      <option value="oral">oral</option>
      <option value="nasal">nasal</option>
      <option value="other">other</option>
    </select>
  </label>
  <label class="block">Dose amount
    <input type="number" step="0.001" class="border rounded w-full p-2" bind:value={e.doseAmountValue} />
  </label>
  <label class="block">Dose unit
    <select class="border rounded w-full p-2" bind:value={e.doseAmountUnit}>
      <option value="">Select…</option>
      <option>mL</option><option>mg</option>
      <option>IU</option><option>drops</option>
    </select>
  </label>
</div>
