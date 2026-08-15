<script lang="ts">
  import { certificateStore } from '#lib/stores/certificate.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  const c = $derived(certificateStore.data);
</script>

<Fieldset legend="Centre & clinician" description="The WHO-designated vaccination centre and the supervising clinician.">
  <div class="field">
    <label class="label" for="centreName">Centre name</label>
    <input id="centreName" class="text-input" bind:value={c.center.name} />
  </div>
  <div class="field">
    <label class="label" for="whoRef">WHO designation reference</label>
    <input id="whoRef" class="text-input" bind:value={c.center.whoDesignationReference} />
  </div>
  <div class="field">
    <label class="label" for="centreCountry">Centre country (ISO 3166-1 alpha-3)</label>
    <input id="centreCountry" class="text-input" maxlength="3" bind:value={c.center.countryAsIso31661Alpha3} />
  </div>
  <div class="field">
    <label class="label" for="clinicianName">Supervising clinician name</label>
    <input id="clinicianName" class="text-input" bind:value={c.clinician.name} />
  </div>
  <div class="field">
    <label class="label" for="clinicianStatus">Professional status</label>
    <select id="clinicianStatus" class="select" bind:value={c.clinician.professionalStatus}>
      <option value="">Select…</option>
      <option>MD</option><option>DO</option><option>RN</option>
      <option>NP</option><option>PA</option><option>Pharmacist</option>
      <option>Paramedic</option><option>other</option>
    </select>
  </div>
  <div class="field">
    <label class="label" for="regBody">Registration body</label>
    <input id="regBody" class="text-input" bind:value={c.clinician.registrationBody} />
  </div>
  <div class="field">
    <label class="label" for="regNumber">Registration number</label>
    <input id="regNumber" class="text-input" bind:value={c.clinician.registrationNumber} />
  </div>
</Fieldset>
