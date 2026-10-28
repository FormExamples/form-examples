<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { DateInput, TextInput } from '@lilydesignsystem/svelte-headless';
</script>

<Fieldset legend="Step 1 of 8 — Employee" id="step-1-legend">
  <p class="hint">Who the fit note is for.</p>
  <Field
    label="Employee name"
    required
    inputId="step-1-employee-name"
    error={store.errors['step-1-employee-name']}
  >
    <TextInput
      id="step-1-employee-name"
      label="Employee name"
      required
      bind:value={store.data.employeeName}
      aria-invalid={store.errors['step-1-employee-name'] ? 'true' : undefined}
    />
  </Field>
  <div class="field-grid">
    <Field label="Date of birth" inputId="step-1-birth-date">
      <DateInput
        id="step-1-birth-date"
        label="Date of birth"
        bind:value={
          () => store.data.employeeBirthDate ?? '',
          (v) => (store.data.employeeBirthDate = v || null)
        }
      />
    </Field>
    <Field label="NHS number" inputId="step-1-nhs-number">
      <TextInput
        id="step-1-nhs-number"
        label="NHS number"
        placeholder="NNN NNN NNNN"
        bind:value={store.data.employeeNhsNumber}
      />
    </Field>
    <Field label="Employer" inputId="step-1-employer">
      <TextInput id="step-1-employer" label="Employer" bind:value={store.data.employerName} />
    </Field>
    <Field label="Job title" inputId="step-1-job-title">
      <TextInput id="step-1-job-title" label="Job title" bind:value={store.data.jobTitle} />
    </Field>
  </div>
</Fieldset>
