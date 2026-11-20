<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const jurisdiction = assessment.data.jurisdiction;
  const decedent = assessment.data.decedent;
</script>

<Fieldset legend="Step 1 of 11 — State and decedent">
  <p class="hint">
    The registering state, which sets the filing deadline and certified-copy fee, and who the
    certificate is about.
  </p>

  <Field label="State of registration" inputId="jurisdiction-state">
    <Select id="jurisdiction-state" label="State of registration" bind:value={jurisdiction.state}>
      <option value="">— Select —</option>
      <option value="CA">California (CA)</option>
      <option value="NY">New York (NY)</option>
      <option value="TX">Texas (TX)</option>
      <option value="FL">Florida (FL)</option>
      <option value="IL">Illinois (IL)</option>
      <option value="PA">Pennsylvania (PA)</option>
      <option value="OH">Ohio (OH)</option>
      <option value="WA">Washington (WA)</option>
      <option value="AK">Alaska (AK; default rule)</option>
      <option value="AZ">Arizona (AZ; default rule)</option>
      <option value="CO">Colorado (CO; default rule)</option>
      <option value="GA">Georgia (GA; default rule)</option>
      <option value="MA">Massachusetts (MA; default rule)</option>
      <option value="MI">Michigan (MI; default rule)</option>
      <option value="NC">North Carolina (NC; default rule)</option>
      <option value="NJ">New Jersey (NJ; default rule)</option>
      <option value="VA">Virginia (VA; default rule)</option>
      <option value="OTHER">Another state or territory (default rule)</option>
    </Select>
  </Field>

  <Field label="Decedent: legal name" inputId="decedent-decedentName">
    <TextInput
      id="decedent-decedentName"
      label="Decedent: legal name"
      placeholder="First, middle, last"
      bind:value={decedent.decedentName}
    />
  </Field>

  <Field label="Sex" inputId="decedent-sex">
    <Select id="decedent-sex" label="Sex" bind:value={decedent.sex}>
      <option value="">— Select —</option>
      <option value="female">Female</option>
      <option value="male">Male</option>
      <option value="unknown">Unknown</option>
    </Select>
  </Field>

  <Field label="Date of birth" inputId="decedent-dateOfBirth">
    <DateInput id="decedent-dateOfBirth" label="Date of birth" bind:value={decedent.dateOfBirth} />
  </Field>

  <Field label="Age at death (years)" inputId="decedent-ageYears">
    <NumberInput
      id="decedent-ageYears"
      label="Age at death (years)"
      min={0}
      max={130}
      bind:value={decedent.ageYears}
    />
  </Field>

  <Field label="Marital status at time of death" inputId="decedent-maritalStatus">
    <Select
      id="decedent-maritalStatus"
      label="Marital status at time of death"
      bind:value={decedent.maritalStatus}
    >
      <option value="">— Select —</option>
      <option value="married">Married</option>
      <option value="married-separated">Married but separated</option>
      <option value="widowed">Widowed</option>
      <option value="divorced">Divorced</option>
      <option value="never-married">Never married</option>
      <option value="unknown">Unknown</option>
    </Select>
  </Field>

  <Field label="Ever in the US Armed Forces?" inputId="decedent-veteranStatus">
    <Select
      id="decedent-veteranStatus"
      label="Ever in the US Armed Forces?"
      bind:value={decedent.veteranStatus}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="State of residence (two letters)" inputId="decedent-stateOfResidence">
    <TextInput
      id="decedent-stateOfResidence"
      label="State of residence (two letters)"
      placeholder="e.g. CA"
      bind:value={decedent.stateOfResidence}
    />
  </Field>
</Fieldset>
