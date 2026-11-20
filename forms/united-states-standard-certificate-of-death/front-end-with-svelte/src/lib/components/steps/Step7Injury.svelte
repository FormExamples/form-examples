<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput, TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const injury = assessment.data.injury;
</script>

<Fieldset legend="Step 7 of 11 — Injury items">
  <p class="hint">
    Complete when the manner of death is accident, suicide or homicide, or when an injury
    contributed.
  </p>

  <Field label="Date of injury" inputId="injury-injuryDate">
    <DateInput id="injury-injuryDate" label="Date of injury" bind:value={injury.injuryDate} />
  </Field>

  <Field label="Time of injury" inputId="injury-injuryTime">
    <DateInput
      id="injury-injuryTime"
      label="Time of injury"
      type="time"
      bind:value={injury.injuryTime}
    />
  </Field>

  <Field label="Place of injury" inputId="injury-injuryPlace">
    <TextInput
      id="injury-injuryPlace"
      label="Place of injury"
      placeholder="e.g. Decedent’s home, construction site, restaurant"
      bind:value={injury.injuryPlace}
    />
  </Field>

  <Field label="Injury at work?" inputId="injury-injuryAtWork">
    <Select id="injury-injuryAtWork" label="Injury at work?" bind:value={injury.injuryAtWork}>
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Location of injury" inputId="injury-injuryLocation">
    <TextInput
      id="injury-injuryLocation"
      label="Location of injury"
      placeholder="State, city, street and number, zip code"
      bind:value={injury.injuryLocation}
    />
  </Field>

  <Field label="Describe how the injury occurred" inputId="injury-injuryDescription">
    <TextAreaInput
      id="injury-injuryDescription"
      label="Describe how the injury occurred"
      rows={3}
      placeholder="e.g. Fell from a ladder while painting a ceiling"
      bind:value={injury.injuryDescription}
    />
  </Field>

  <Field
    label="If a transportation injury, the decedent was the"
    inputId="injury-transportationInjuryRole"
  >
    <Select
      id="injury-transportationInjuryRole"
      label="If a transportation injury, the decedent was the"
      bind:value={injury.transportationInjuryRole}
    >
      <option value="">— Select —</option>
      <option value="driver-operator">Driver or operator</option>
      <option value="passenger">Passenger</option>
      <option value="pedestrian">Pedestrian</option>
      <option value="other">Other</option>
    </Select>
  </Field>
</Fieldset>
