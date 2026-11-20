<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import { US_STATES } from '#lib/engine/utils.js';

  const v = assessment.data.applicantTwo;
</script>

<Fieldset legend="Step 3 of 6 — Second applicant">
  <p class="hint">
    Details of the second applicant, as they appear on government photo identification.
  </p>

  <Field label="Second applicant — full legal name" inputId="applicantTwo-name">
    <TextInput
      id="applicantTwo-name"
      label="Second applicant — full legal name"
      bind:value={v.name}
    />
  </Field>
  <Field label="Sex or gender" inputId="applicantTwo-sex">
    <Select id="applicantTwo-sex" label="Sex or gender" bind:value={v.sex}>
      <option value="">— Select —</option>
      <option value="female">Female</option>
      <option value="male">Male</option>
      <option value="nonbinary">Nonbinary</option>
      <option value="unknown">Prefer not to say</option>
    </Select>
  </Field>
  <Field label="Date of birth" inputId="applicantTwo-dateOfBirth">
    <DateInput id="applicantTwo-dateOfBirth" label="Date of birth" bind:value={v.dateOfBirth} />
  </Field>
  <Field label="Place of birth" inputId="applicantTwo-placeOfBirth">
    <TextInput
      id="applicantTwo-placeOfBirth"
      label="Place of birth"
      placeholder="City, state or country"
      bind:value={v.placeOfBirth}
    />
  </Field>
  <Field label="State of residence" inputId="applicantTwo-residenceState">
    <Select
      id="applicantTwo-residenceState"
      label="State of residence"
      bind:value={v.residenceState}
    >
      <option value="">— Select —</option>
      {#each US_STATES as [code, stateName] (code)}
        <option value={code}>{stateName} ({code})</option>
      {/each}
    </Select>
  </Field>
  <Field label="Government photo ID presented?" inputId="applicantTwo-idPresented">
    <Select
      id="applicantTwo-idPresented"
      label="Government photo ID presented?"
      bind:value={v.idPresented}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Social Security number" inputId="applicantTwo-ssnStatus">
    <Select id="applicantTwo-ssnStatus" label="Social Security number" bind:value={v.ssnStatus}>
      <option value="">— Select —</option>
      <option value="provided">Provided to the clerk</option>
      <option value="none-issued">No Social Security number issued</option>
      <option value="declined">Declined to provide</option>
    </Select>
  </Field>
  <Field label="Marital status before this marriage" inputId="applicantTwo-maritalStatus">
    <Select
      id="applicantTwo-maritalStatus"
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
  <Field label="Date the prior marriage ended" inputId="applicantTwo-priorMarriageEndedDate">
    <DateInput
      id="applicantTwo-priorMarriageEndedDate"
      label="Date the prior marriage ended"
      bind:value={v.priorMarriageEndedDate}
    />
  </Field>
</Fieldset>
