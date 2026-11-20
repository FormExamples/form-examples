<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const c = assessment.data.child;
</script>

<Fieldset legend="Step 1 of 5 — The child">
  <p class="hint">
    Who was born, when and where. A birth in England or Wales must be registered within 42 days.
  </p>

  <Field label="Child's forename(s)" inputId="child-childForenames">
    <TextInput
      id="child-childForenames"
      label="Child's forename(s)"
      placeholder="First and middle names"
      bind:value={c.childForenames}
    />
  </Field>

  <Field label="Child's surname" inputId="child-childSurname">
    <TextInput id="child-childSurname" label="Child's surname" bind:value={c.childSurname} />
  </Field>

  <Field label="Sex" inputId="child-sex">
    <Select id="child-sex" label="Sex" bind:value={c.sex}>
      <option value="">— Select —</option>
      <option value="female">Female</option>
      <option value="male">Male</option>
      <option value="indeterminate">Indeterminate</option>
    </Select>
  </Field>

  <Field label="Date of birth" inputId="child-dateOfBirth">
    <DateInput id="child-dateOfBirth" label="Date of birth" bind:value={c.dateOfBirth} />
  </Field>

  <Field label="Time of birth" inputId="child-timeOfBirth">
    <DateInput
      id="child-timeOfBirth"
      label="Time of birth"
      type="time"
      bind:value={c.timeOfBirth}
    />
  </Field>

  <Field label="Type of place of birth" inputId="child-placeOfBirthType">
    <Select
      id="child-placeOfBirthType"
      label="Type of place of birth"
      bind:value={c.placeOfBirthType}
    >
      <option value="">— Select —</option>
      <option value="hospital">Hospital</option>
      <option value="home">Home</option>
      <option value="birth-centre">Birth centre</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field label="Place of birth" inputId="child-placeOfBirth">
    <TextInput
      id="child-placeOfBirth"
      label="Place of birth"
      placeholder="e.g. Royal Berkshire Hospital, Reading"
      bind:value={c.placeOfBirth}
    />
  </Field>

  <Field label="Country of birth" inputId="child-birthCountry">
    <Select id="child-birthCountry" label="Country of birth" bind:value={c.birthCountry}>
      <option value="">— Select —</option>
      <option value="england">England</option>
      <option value="wales">Wales</option>
      <option value="scotland">Scotland</option>
      <option value="northern-ireland">Northern Ireland</option>
      <option value="abroad">Outside the United Kingdom</option>
    </Select>
  </Field>

  <Field label="Single or multiple birth" inputId="child-multipleBirth">
    <Select id="child-multipleBirth" label="Single or multiple birth" bind:value={c.multipleBirth}>
      <option value="">— Select —</option>
      <option value="single">Single birth</option>
      <option value="twins">Twins</option>
      <option value="triplets-or-more">Triplets or more</option>
    </Select>
  </Field>

  <Field
    label="Born dead after the 24th week of pregnancy (stillbirth)?"
    inputId="child-stillbirth"
  >
    <Select
      id="child-stillbirth"
      label="Born dead after the 24th week of pregnancy (stillbirth)?"
      bind:value={c.stillbirth}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
