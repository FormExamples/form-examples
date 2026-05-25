<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import DateInput from '$lib/components/ui/DateInput.svelte';
</script>

<Fieldset legend="Step 2 — Patient and planned procedure">
  <div class="field-grid">
    <Field label="NHS number">
      <TextInput label="NHS number" bind:value={store.data.patient.nhsNumber} />
    </Field>
    <Field label="Date of birth">
      <DateInput label="Date of birth" bind:value={store.data.patient.dateOfBirth} />
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
  </div>

  <h3 class="step-subhead">Planned procedure</h3>
  <div class="field-grid">
    <Field label="Planned procedure" class="field-span-2" inputId="step-2-planned-procedure" error={store.errors['step-2-planned-procedure']}>
      <TextInput
        id="step-2-planned-procedure"
        label="Planned procedure"
        bind:value={store.data.surgery.plannedProcedure}
        aria-invalid={store.errors['step-2-planned-procedure'] ? 'true' : undefined}
      />
    </Field>
    <Field label="Specialty">
      <TextInput label="Specialty" bind:value={store.data.surgery.surgicalSpecialty} />
    </Field>
    <Field label="Urgency">
      <Select label="Urgency" bind:value={store.data.surgery.urgency}>
        <option value="">—</option>
        <option value="elective">Elective</option>
        <option value="urgent">Urgent</option>
        <option value="emergency">Emergency</option>
        <option value="immediate">Immediate</option>
      </Select>
    </Field>
    <Field label="Surgical severity (NICE NG45)" inputId="step-2-surgical-severity" error={store.errors['step-2-surgical-severity']}>
      <Select
        id="step-2-surgical-severity"
        label="Surgical severity (NICE NG45)"
        bind:value={store.data.surgery.surgicalSeverity}
        aria-invalid={store.errors['step-2-surgical-severity'] ? 'true' : undefined}
      >
        <option value="">—</option>
        <option value="minor">Minor</option>
        <option value="intermediate">Intermediate</option>
        <option value="major">Major</option>
        <option value="major-plus">Major+</option>
      </Select>
    </Field>
    <Field label="Laterality">
      <Select label="Laterality" bind:value={store.data.surgery.laterality}>
        <option value="">—</option>
        <option value="left">Left</option>
        <option value="right">Right</option>
        <option value="bilateral">Bilateral</option>
        <option value="midline">Midline</option>
        <option value="na">N/A</option>
      </Select>
    </Field>
    <Field label="Anticipated blood loss (mL)">
      <NumberInput label="Anticipated blood loss (mL)" bind:value={store.data.surgery.anticipatedBloodLossMl} />
    </Field>
    <Field label="Anticipated duration (min)">
      <NumberInput label="Anticipated duration (min)" bind:value={store.data.surgery.anticipatedDurationMinutes} />
    </Field>
    <Field label="Consultant surgeon">
      <TextInput label="Consultant surgeon" bind:value={store.data.surgery.consultantSurgeon} />
    </Field>
    <Field label="Planned date">
      <DateInput label="Planned date" bind:value={store.data.surgery.plannedDate} />
    </Field>
  </div>
</Fieldset>
