<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
</script>

<Fieldset legend="Step 1 — Clinician identification">
  <div class="field-grid">
    <Field label="Clinician name" inputId="step-1-clinician-name" error={store.errors['step-1-clinician-name']}>
      <TextInput
        id="step-1-clinician-name"
        label="Clinician name"
        bind:value={store.data.clinician.clinicianName}
        aria-invalid={store.errors['step-1-clinician-name'] ? 'true' : undefined}
      />
    </Field>
    <Field label="Role">
      <Select label="Role" bind:value={store.data.clinician.clinicianRole}>
        <option value="">—</option>
        <option value="anaesthetist">Anaesthetist</option>
        <option value="surgeon">Surgeon</option>
        <option value="preop-nurse">Pre-op nurse</option>
        <option value="perioperative-physician">Perioperative physician</option>
        <option value="geriatrician">Geriatrician</option>
        <option value="pharmacist">Pharmacist</option>
        <option value="other">Other</option>
      </Select>
    </Field>
    <Field label="Registration body">
      <Select label="Registration body" bind:value={store.data.clinician.registrationBody}>
        <option value="">—</option>
        <option value="GMC">GMC</option>
        <option value="NMC">NMC</option>
        <option value="HCPC">HCPC</option>
        <option value="GPhC">GPhC</option>
        <option value="other">Other</option>
      </Select>
    </Field>
    <Field label="Registration number">
      <TextInput label="Registration number" bind:value={store.data.clinician.registrationNumber} />
    </Field>
    <Field label="Site">
      <TextInput label="Site" bind:value={store.data.clinician.siteName} />
    </Field>
    <Field label="Assessment date" inputId="step-1-assessment-date" error={store.errors['step-1-assessment-date']}>
      <DateInput
        id="step-1-assessment-date"
        label="Assessment date"
        bind:value={store.data.clinician.assessmentDate}
        aria-invalid={store.errors['step-1-assessment-date'] ? 'true' : undefined}
      />
    </Field>
    <Field label="Assessment time">
      <input
        class="time-input"
        type="time"
        aria-label="Assessment time"
        bind:value={store.data.clinician.assessmentTime}
      />
    </Field>
  </div>
</Fieldset>
