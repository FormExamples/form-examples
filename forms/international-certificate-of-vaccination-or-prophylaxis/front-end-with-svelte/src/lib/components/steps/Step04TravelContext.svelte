<script lang="ts">
  import { certificateStore } from '#lib/stores/certificate.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  const c = $derived(certificateStore.data);
</script>

<Fieldset legend="Travel context" description="Destination and declared clinical considerations relevant to contraindications.">
  <div class="field">
    <label class="label" for="destinations">Destination countries (space-separated alpha-3)</label>
    <input id="destinations" class="text-input" bind:value={c.destinationCountriesAsIso31661Alpha3} />
  </div>
  <div class="field">
    <label class="label" for="arrivalDate">Planned arrival date</label>
    <input id="arrivalDate" type="date" class="date-input" bind:value={c.plannedArrivalDate} />
  </div>
  <div class="field">
    <label class="label" for="purpose">Purpose of travel</label>
    <select id="purpose" class="select" bind:value={c.purposeOfTravel}>
      <option value="">Select…</option>
      <option>tourism</option><option>business</option>
      <option>study</option><option>employment</option>
      <option>humanitarian</option><option>military</option>
      <option>family</option><option>medical</option>
      <option>other</option>
    </select>
  </div>
  <div class="field">
    <label class="label" for="pregnancy">Declared pregnancy?</label>
    <select id="pregnancy" class="select" bind:value={c.declaredPregnancy}>
      <option value="">No</option><option value="yes">Yes</option>
    </select>
  </div>
  <div class="field">
    <label class="label" for="breastfeeding">Declared breastfeeding?</label>
    <select id="breastfeeding" class="select" bind:value={c.declaredBreastfeeding}>
      <option value="">No</option><option value="yes">Yes</option>
    </select>
  </div>
  <div class="field">
    <label class="label" for="immunosuppression">Declared immunosuppression?</label>
    <select id="immunosuppression" class="select" bind:value={c.declaredImmunosuppression}>
      <option value="">No</option><option value="yes">Yes</option>
    </select>
  </div>
</Fieldset>
