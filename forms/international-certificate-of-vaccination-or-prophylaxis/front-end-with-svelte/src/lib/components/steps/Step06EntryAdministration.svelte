<script lang="ts">
  import { certificateStore } from '#lib/stores/certificate.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  const e = $derived(certificateStore.data.entries[0]);
</script>

<Fieldset legend="Vaccination entry — administration" description="The administering clinician must sign each entry by hand; stamps are not acceptable.">
  <div class="field">
    <label class="label" for="vaccinationDate">Date of vaccination</label>
    <input id="vaccinationDate" type="date" class="date-input" bind:value={e.vaccinationDate} />
  </div>
  <div class="field">
    <label class="label" for="vaccinationTime">Time of vaccination</label>
    <input id="vaccinationTime" type="time" class="time-input" bind:value={e.vaccinationTime} />
  </div>
  <div class="field">
    <label class="label" for="adminSignature">Administering clinician signature (typed/drawn)</label>
    <input id="adminSignature" class="text-input" bind:value={e.administeringClinicianSignatureDataUrl} />
  </div>
  <div class="field">
    <label class="label" for="adminStatus">Administering clinician professional status</label>
    <select id="adminStatus" class="select" bind:value={e.administeringClinicianProfessionalStatus}>
      <option value="">Select…</option>
      <option>MD</option><option>DO</option><option>RN</option>
      <option>NP</option><option>PA</option><option>Pharmacist</option>
      <option>Paramedic</option><option>other</option>
    </select>
  </div>
</Fieldset>
