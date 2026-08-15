<script lang="ts">
  import { store } from '#lib/state.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 2 — Patient identification">
  <div class="field-grid">
    <Field label="NHS number">
      <TextInput label="NHS number" bind:value={store.data.patient.nhsNumber} />
    </Field>
    <Field label="MRN">
      <TextInput label="MRN" bind:value={store.data.patient.mrn} />
    </Field>
    <Field label="First name" inputId="step-2-first-name" error={store.errors['step-2-first-name']}>
      <TextInput
        id="step-2-first-name"
        label="First name"
        bind:value={store.data.patient.firstName}
        aria-invalid={store.errors['step-2-first-name'] ? 'true' : undefined}
      />
    </Field>
    <Field label="Last name" inputId="step-2-last-name" error={store.errors['step-2-last-name']}>
      <TextInput
        id="step-2-last-name"
        label="Last name"
        bind:value={store.data.patient.lastName}
        aria-invalid={store.errors['step-2-last-name'] ? 'true' : undefined}
      />
    </Field>
    <Field label="Date of birth">
      <DateInput label="Date of birth" bind:value={store.data.patient.dateOfBirth} />
    </Field>
    <Field label="Sex">
      <Select label="Sex" bind:value={store.data.patient.sex}>
        <option value="">—</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </Select>
    </Field>
    <Field label="Weight (kg)">
      <NumberInput label="Weight (kg)" step="0.1" bind:value={store.data.patient.weightKg} />
    </Field>
    <Field label="Height (cm)">
      <NumberInput label="Height (cm)" step="0.1" bind:value={store.data.patient.heightCm} />
    </Field>
    <Field label="Allergies summary" class="field-span-2">
      <TextInput label="Allergies summary" bind:value={store.data.patient.allergiesSummary} />
    </Field>
    <Field label="Consent status">
      <Select label="Consent status" bind:value={store.data.patient.consentStatus}>
        <option value="">—</option>
        <option value="valid">Valid signed consent</option>
        <option value="not-required">Not required</option>
        <option value="emergency-best-interest">Emergency / best-interest</option>
        <option value="mca-best-interest">MCA best-interest</option>
      </Select>
    </Field>
    <Field label="Side marked">
      <Select label="Side marked" bind:value={store.data.patient.sideMarked}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No / not applicable</option>
      </Select>
    </Field>
    <Field label="WHO Sign-In completed">
      <Select label="WHO Sign-In completed" bind:value={store.data.patient.whoSignInCompleted}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
  </div>
</Fieldset>
