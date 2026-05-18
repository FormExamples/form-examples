<script lang="ts">
  import { certificateStore } from '$lib/stores/certificate.svelte';
  const c = $derived(certificateStore.data);
</script>

<div class="space-y-3">
  <label class="block">Surname
    <input class="border rounded w-full p-2" bind:value={c.patient.surname} />
  </label>
  <label class="block">Given names
    <input class="border rounded w-full p-2" bind:value={c.patient.givenNames} />
  </label>
  <label class="block">Date of birth
    <input type="date" class="border rounded w-full p-2" bind:value={c.patient.birthDate} />
  </label>
  <label class="block">Sex
    <select class="border rounded w-full p-2" bind:value={c.patient.sex}>
      <option value="">Select…</option>
      <option>male</option><option>female</option>
      <option>other</option><option>unspecified</option>
    </select>
  </label>
  <label class="block">Nationality (ISO 3166-1 alpha-3)
    <input class="border rounded w-full p-2" maxlength="3" bind:value={c.patient.nationalityAsIso31661Alpha3} />
  </label>
  <label class="block">Travel document kind
    <select class="border rounded w-full p-2" bind:value={c.patient.travelDocumentKind}>
      <option value="">Select…</option>
      <option value="passport">passport</option>
      <option value="national-id">national-id</option>
      <option value="travel-document">travel-document</option>
      <option value="other">other</option>
    </select>
  </label>
  <label class="block">Travel document number
    <input class="border rounded w-full p-2" bind:value={c.patient.travelDocumentNumber} />
  </label>
</div>
