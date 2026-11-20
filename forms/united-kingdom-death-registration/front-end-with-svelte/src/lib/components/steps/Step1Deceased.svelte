<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const p = assessment.data.deceased;
</script>

<Fieldset legend="Step 1 of 6 — The deceased and the death">
  <p class="hint">
    Who died, when and where. This process covers deaths in England and Wales only.
  </p>

  <Field label="Deceased — full name" inputId="deceased-deceasedName">
    <TextInput
      id="deceased-deceasedName"
      label="Deceased — full name"
      placeholder="Full name of the deceased"
      bind:value={p.deceasedName}
    />
  </Field>
  <Field label="Sex" inputId="deceased-sex">
    <Select id="deceased-sex" label="Sex" bind:value={p.sex}>
      <option value="">— Select —</option>
      <option value="female">Female</option>
      <option value="male">Male</option>
      <option value="other">Other</option>
      <option value="unknown">Unknown</option>
    </Select>
  </Field>
  <Field label="Date of birth" inputId="deceased-dateOfBirth">
    <DateInput id="deceased-dateOfBirth" label="Date of birth" bind:value={p.dateOfBirth} />
  </Field>
  <Field label="Date of death" inputId="deceased-dateOfDeath">
    <DateInput id="deceased-dateOfDeath" label="Date of death" bind:value={p.dateOfDeath} />
  </Field>
  <Field label="Place of death" inputId="deceased-placeOfDeath">
    <TextInput
      id="deceased-placeOfDeath"
      label="Place of death"
      placeholder="Hospital, home, care home or other"
      bind:value={p.placeOfDeath}
    />
  </Field>
  <Field label="Where did the death occur?" inputId="deceased-deathJurisdiction">
    <Select
      id="deceased-deathJurisdiction"
      label="Where did the death occur?"
      bind:value={p.deathJurisdiction}
    >
      <option value="">— Select —</option>
      <option value="england-wales">England or Wales</option>
      <option value="scotland">Scotland</option>
      <option value="northern-ireland">Northern Ireland</option>
      <option value="abroad">Abroad</option>
    </Select>
  </Field>
  <p class="hint">Scotland, Northern Ireland and deaths abroad follow different rules.</p>
  <Field
    label="Can the informant give the deceased’s full particulars?"
    inputId="deceased-deceasedParticularsKnown"
  >
    <Select
      id="deceased-deceasedParticularsKnown"
      label="Can the informant give the deceased’s full particulars?"
      bind:value={p.deceasedParticularsKnown}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">Names, date and place of birth, last address, occupation and marital status.</p>
</Fieldset>
