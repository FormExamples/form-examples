<script lang="ts">
  import { certificateStore } from '$lib/stores/certificate.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  const c = $derived(certificateStore.data);
</script>

<Fieldset legend="Vaccinee identity" description="The traveller named on the certificate.">
  <div class="field">
    <label class="label" for="surname">Surname</label>
    <input id="surname" class="text-input" bind:value={c.patient.surname} />
  </div>
  <div class="field">
    <label class="label" for="givenNames">Given names</label>
    <input id="givenNames" class="text-input" bind:value={c.patient.givenNames} />
  </div>
  <div class="field">
    <label class="label" for="birthDate">Date of birth</label>
    <input id="birthDate" type="date" class="date-input" bind:value={c.patient.birthDate} />
  </div>
  <div class="field">
    <label class="label" for="sex">Sex</label>
    <select id="sex" class="select" bind:value={c.patient.sex}>
      <option value="">Select…</option>
      <option>male</option><option>female</option>
      <option>other</option><option>unspecified</option>
    </select>
  </div>
  <div class="field">
    <label class="label" for="nationality">Nationality (ISO 3166-1 alpha-3)</label>
    <input id="nationality" class="text-input" maxlength="3" bind:value={c.patient.nationalityAsIso31661Alpha3} />
  </div>
  <div class="field">
    <label class="label" for="travelDocKind">Travel document kind</label>
    <select id="travelDocKind" class="select" bind:value={c.patient.travelDocumentKind}>
      <option value="">Select…</option>
      <option value="passport">passport</option>
      <option value="national-id">national-id</option>
      <option value="travel-document">travel-document</option>
      <option value="other">other</option>
    </select>
  </div>
  <div class="field">
    <label class="label" for="travelDocNumber">Travel document number</label>
    <input id="travelDocNumber" class="text-input" bind:value={c.patient.travelDocumentNumber} />
  </div>
</Fieldset>
