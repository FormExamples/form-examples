<script lang="ts">
  import { certificateStore } from '$lib/stores/certificate.svelte';
  const c = $derived(certificateStore.data);
</script>

<div class="space-y-3">
  <label class="block">Centre name
    <input class="border rounded w-full p-2" bind:value={c.center.name} />
  </label>
  <label class="block">WHO designation reference
    <input class="border rounded w-full p-2" bind:value={c.center.whoDesignationReference} />
  </label>
  <label class="block">Centre country (ISO 3166-1 alpha-3)
    <input class="border rounded w-full p-2" maxlength="3" bind:value={c.center.countryAsIso31661Alpha3} />
  </label>
  <label class="block">Supervising clinician name
    <input class="border rounded w-full p-2" bind:value={c.clinician.name} />
  </label>
  <label class="block">Professional status
    <select class="border rounded w-full p-2" bind:value={c.clinician.professionalStatus}>
      <option value="">Select…</option>
      <option>MD</option><option>DO</option><option>RN</option>
      <option>NP</option><option>PA</option><option>Pharmacist</option>
      <option>Paramedic</option><option>other</option>
    </select>
  </label>
  <label class="block">Registration body
    <input class="border rounded w-full p-2" bind:value={c.clinician.registrationBody} />
  </label>
  <label class="block">Registration number
    <input class="border rounded w-full p-2" bind:value={c.clinician.registrationNumber} />
  </label>
</div>
