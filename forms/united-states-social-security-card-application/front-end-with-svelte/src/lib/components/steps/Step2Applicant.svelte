<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import { OPTIONS } from '#lib/engine/utils.js';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const v = assessment.data.applicant;
</script>

<Fieldset legend="Step 2 of 6 — The applicant">
  <p class="hint">
    Items 1 to 11, 13, 14, 16, and 17 of Form SS-5. Do not enter the Social Security number.
  </p>

  <Field label="Name to be shown on the card (item 1)" inputId="applicant-nameOnCard">
    <TextInput
      id="applicant-nameOnCard"
      label="Name to be shown on the card (item 1)"
      placeholder="First, middle, last"
      bind:value={v.nameOnCard}
    />
  </Field>
  <Field label="Full name at birth (item 2)" inputId="applicant-nameAtBirth">
    <TextInput
      id="applicant-nameAtBirth"
      label="Full name at birth (item 2)"
      placeholder=""
      bind:value={v.nameAtBirth}
    />
  </Field>
  <Field label="Other names used (item 3)" inputId="applicant-otherNamesUsed">
    <TextInput
      id="applicant-otherNamesUsed"
      label="Other names used (item 3)"
      placeholder=""
      bind:value={v.otherNamesUsed}
    />
  </Field>
  <Field
    label="Name on the most recent Social Security card (item 13)"
    inputId="applicant-nameOnMostRecentCard"
  >
    <TextInput
      id="applicant-nameOnMostRecentCard"
      label="Name on the most recent Social Security card (item 13)"
      placeholder=""
      bind:value={v.nameOnMostRecentCard}
    />
  </Field>
  <p class="hint">Required for a replacement or corrected card.</p>
  <Field label="Date of birth (item 7)" inputId="applicant-dateOfBirth">
    <DateInput
      id="applicant-dateOfBirth"
      label="Date of birth (item 7)"
      bind:value={v.dateOfBirth}
    />
  </Field>
  <Field label="City or town of birth (item 6)" inputId="applicant-placeOfBirthCity">
    <TextInput
      id="applicant-placeOfBirthCity"
      label="City or town of birth (item 6)"
      placeholder=""
      bind:value={v.placeOfBirthCity}
    />
  </Field>
  <Field label="State or country of birth (item 6)" inputId="applicant-placeOfBirthRegion">
    <TextInput
      id="applicant-placeOfBirthRegion"
      label="State or country of birth (item 6)"
      placeholder=""
      bind:value={v.placeOfBirthRegion}
    />
  </Field>
  <Field label="Sex (item 11)" inputId="applicant-sex">
    <Select id="applicant-sex" label="Sex (item 11)" bind:value={v.sex}>
      <option value="">— Select —</option>
      {#each OPTIONS.sex as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <Field label="Citizenship (item 8)" inputId="applicant-citizenship">
    <Select id="applicant-citizenship" label="Citizenship (item 8)" bind:value={v.citizenship}>
      <option value="">— Select —</option>
      {#each OPTIONS.citizenship as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <Field
    label="If a legal alien not allowed to work: is a valid non-work reason documented?"
    inputId="applicant-nonWorkReasonValid"
  >
    <Select
      id="applicant-nonWorkReasonValid"
      label="If a legal alien not allowed to work: is a valid non-work reason documented?"
      bind:value={v.nonWorkReasonValid}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.yesNo as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <p class="hint">
    A federal statute or regulation, or a state or local law, that requires an SSN to receive a
    benefit.
  </p>
  <Field label="Mother's name at her birth (item 4)" inputId="applicant-motherNameAtBirth">
    <TextInput
      id="applicant-motherNameAtBirth"
      label="Mother's name at her birth (item 4)"
      placeholder=""
      bind:value={v.motherNameAtBirth}
    />
  </Field>
  <p class="hint">Write "unknown" if not known.</p>
  <Field label="Father's name (item 5)" inputId="applicant-fatherName">
    <TextInput
      id="applicant-fatherName"
      label="Father's name (item 5)"
      placeholder=""
      bind:value={v.fatherName}
    />
  </Field>
  <p class="hint">Write "unknown" if not known.</p>
  <Field label="State of residence" inputId="applicant-stateOfResidence">
    <TextInput
      id="applicant-stateOfResidence"
      label="State of residence"
      placeholder="e.g. CA"
      bind:value={v.stateOfResidence}
    />
  </Field>
  <p class="hint">Two-letter USPS code. The SS-5 rules are federal and do not vary by state.</p>
  <Field label="Mailing address (item 17)" inputId="applicant-mailingAddress">
    <TextAreaInput
      id="applicant-mailingAddress"
      label="Mailing address (item 17)"
      rows={3}
      placeholder="Street, city, state, ZIP"
      bind:value={v.mailingAddress}
    />
  </Field>
  <Field label="Daytime telephone (item 16)" inputId="applicant-phone">
    <TextInput
      id="applicant-phone"
      label="Daytime telephone (item 16)"
      placeholder=""
      bind:value={v.phone}
    />
  </Field>
</Fieldset>
