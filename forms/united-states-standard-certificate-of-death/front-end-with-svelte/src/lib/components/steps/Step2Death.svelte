<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const death = assessment.data.death;
</script>

<Fieldset legend="Step 2 of 11 — Death details">
  <p class="hint">When and where the death occurred.</p>

  <Field label="Date of death" inputId="death-dateOfDeath">
    <DateInput id="death-dateOfDeath" label="Date of death" bind:value={death.dateOfDeath} />
  </Field>

  <Field label="Time of death" inputId="death-timeOfDeath">
    <DateInput
      id="death-timeOfDeath"
      label="Time of death"
      type="time"
      bind:value={death.timeOfDeath}
    />
  </Field>

  <Field label="Place of death" inputId="death-placeOfDeathType">
    <Select id="death-placeOfDeathType" label="Place of death" bind:value={death.placeOfDeathType}>
      <option value="">— Select —</option>
      <option value="hospital-inpatient">Hospital: inpatient</option>
      <option value="hospital-emergency-outpatient">Hospital: emergency room or outpatient</option>
      <option value="hospital-dead-on-arrival">Hospital: dead on arrival</option>
      <option value="decedent-home">Decedent’s home</option>
      <option value="hospice">Hospice facility</option>
      <option value="nursing-home">Nursing home or long-term care facility</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field label="Facility name or address where death occurred" inputId="death-placeOfDeathFacility">
    <TextInput
      id="death-placeOfDeathFacility"
      label="Facility name or address where death occurred"
      placeholder="Hospital, residence address, or where the body was found"
      bind:value={death.placeOfDeathFacility}
    />
  </Field>
</Fieldset>
