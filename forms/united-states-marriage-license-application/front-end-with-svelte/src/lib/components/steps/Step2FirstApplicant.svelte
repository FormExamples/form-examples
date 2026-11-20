<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import { US_STATES } from '#lib/engine/utils.js';

  const v = assessment.data.applicantOne;
</script>

<Fieldset legend="Step 2 of 6 — First applicant">
  <p class="hint">
    Details of the first applicant, as they appear on government photo identification.
  </p>

  <Field label="First applicant — full legal name" inputId="applicantOne-name">
    <TextInput
      id="applicantOne-name"
      label="First applicant — full legal name"
      bind:value={v.name}
    />
  </Field>
  <Field label="Sex or gender" inputId="applicantOne-sex">
    <Select id="applicantOne-sex" label="Sex or gender" bind:value={v.sex}>
      <option value="">— Select —</option>
      <option value="female">Female</option>
      <option value="male">Male</option>
      <option value="nonbinary">Nonbinary</option>
      <option value="unknown">Prefer not to say</option>
    </Select>
  </Field>
  <Field label="Date of birth" inputId="applicantOne-dateOfBirth">
    <DateInput id="applicantOne-dateOfBirth" label="Date of birth" bind:value={v.dateOfBirth} />
  </Field>
  <Field label="Place of birth" inputId="applicantOne-placeOfBirth">
    <TextInput
      id="applicantOne-placeOfBirth"
      label="Place of birth"
      placeholder="City, state or country"
      bind:value={v.placeOfBirth}
    />
  </Field>
  <Field label="State of residence" inputId="applicantOne-residenceState">
    <Select
      id="applicantOne-residenceState"
      label="State of residence"
      bind:value={v.residenceState}
    >
      <option value="">— Select —</option>
      {#each US_STATES as [code, stateName] (code)}
        <option value={code}>{stateName} ({code})</option>
      {/each}
    </Select>
  </Field>
  <Field label="Government photo ID presented?" inputId="applicantOne-idPresented">
    <Select
      id="applicantOne-idPresented"
      label="Government photo ID presented?"
      bind:value={v.idPresented}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Social Security number" inputId="applicantOne-ssnStatus">
    <Select id="applicantOne-ssnStatus" label="Social Security number" bind:value={v.ssnStatus}>
      <option value="">— Select —</option>
      <option value="provided">Provided to the clerk</option>
      <option value="none-issued">No Social Security number issued</option>
      <option value="declined">Declined to provide</option>
    </Select>
  </Field>
  <Field label="Marital status before this marriage" inputId="applicantOne-maritalStatus">
    <Select
      id="applicantOne-maritalStatus"
      label="Marital status before this marriage"
      bind:value={v.maritalStatus}
    >
      <option value="">— Select —</option>
      <option value="never-married">Never married</option>
      <option value="divorced">Divorced</option>
      <option value="widowed">Widowed</option>
      <option value="annulled">Previous marriage annulled</option>
      <option value="currently-married">Currently married</option>
    </Select>
  </Field>
  <Field label="Date the prior marriage ended" inputId="applicantOne-priorMarriageEndedDate">
    <DateInput
      id="applicantOne-priorMarriageEndedDate"
      label="Date the prior marriage ended"
      bind:value={v.priorMarriageEndedDate}
    />
  </Field>
</Fieldset>
