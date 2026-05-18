<script lang="ts">
  import { certificateStore } from '$lib/stores/certificate.svelte';
  const e = $derived(certificateStore.data.entries[0]);
</script>

<div class="space-y-3">
  <label class="block">Date of vaccination
    <input type="date" class="border rounded w-full p-2" bind:value={e.vaccinationDate} />
  </label>
  <label class="block">Time of vaccination
    <input type="time" class="border rounded w-full p-2" bind:value={e.vaccinationTime} />
  </label>
  <label class="block">Administering clinician signature (typed/drawn)
    <input class="border rounded w-full p-2" bind:value={e.administeringClinicianSignatureDataUrl} />
  </label>
  <label class="block">Administering clinician professional status
    <select class="border rounded w-full p-2" bind:value={e.administeringClinicianProfessionalStatus}>
      <option value="">Select…</option>
      <option>MD</option><option>DO</option><option>RN</option>
      <option>NP</option><option>PA</option><option>Pharmacist</option>
      <option>Paramedic</option><option>other</option>
    </select>
  </label>
</div>
