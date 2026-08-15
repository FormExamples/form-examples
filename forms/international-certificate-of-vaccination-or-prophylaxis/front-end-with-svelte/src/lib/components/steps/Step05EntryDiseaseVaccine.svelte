<script lang="ts">
  import { certificateStore } from '#lib/stores/certificate.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  const e = $derived(certificateStore.data.entries[0]);
</script>

<Fieldset legend="Vaccination entry — disease & vaccine">
  <div class="field">
    <label class="label" for="disease">Disease</label>
    <select id="disease" class="select" bind:value={e.disease}>
      <option value="">Select…</option>
      <option value="yellow-fever">yellow-fever</option>
      <option value="polio">polio</option>
      <option value="smallpox">smallpox</option>
      <option value="cholera">cholera</option>
      <option value="meningococcal">meningococcal</option>
      <option value="covid-19">covid-19</option>
      <option value="other">other</option>
    </select>
  </div>
  <div class="field">
    <label class="label" for="vaccineName">Vaccine name</label>
    <input id="vaccineName" class="text-input" bind:value={e.vaccineOrProphylaxisName} />
  </div>
  <div class="field">
    <label class="label" for="manufacturer">Manufacturer</label>
    <input id="manufacturer" class="text-input" bind:value={e.manufacturer} />
  </div>
  <div class="field">
    <label class="label" for="batchNumber">Batch number</label>
    <input id="batchNumber" class="text-input" bind:value={e.batchNumber} />
  </div>
  <div class="field">
    <label class="label" for="route">Route</label>
    <select id="route" class="select" bind:value={e.route}>
      <option value="">Select…</option>
      <option>intramuscular</option><option>subcutaneous</option>
      <option>intradermal</option><option>oral</option>
      <option>intranasal</option><option>other</option>
    </select>
  </div>
  <div class="field">
    <label class="label" for="site">Anatomical site</label>
    <select id="site" class="select" bind:value={e.anatomicalSite}>
      <option value="">Select…</option>
      <option value="left-deltoid">left-deltoid</option>
      <option value="right-deltoid">right-deltoid</option>
      <option value="left-thigh">left-thigh</option>
      <option value="right-thigh">right-thigh</option>
      <option value="oral">oral</option>
      <option value="nasal">nasal</option>
      <option value="other">other</option>
    </select>
  </div>
  <div class="field">
    <label class="label" for="doseValue">Dose amount</label>
    <input id="doseValue" type="number" step="0.001" class="number-input" bind:value={e.doseAmountValue} />
  </div>
  <div class="field">
    <label class="label" for="doseUnit">Dose unit</label>
    <select id="doseUnit" class="select" bind:value={e.doseAmountUnit}>
      <option value="">Select…</option>
      <option>mL</option><option>mg</option>
      <option>IU</option><option>drops</option>
    </select>
  </div>
</Fieldset>
