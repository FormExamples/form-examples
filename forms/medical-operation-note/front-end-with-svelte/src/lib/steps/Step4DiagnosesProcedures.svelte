<script lang="ts">
  import { store } from '#lib/state.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 4 — Diagnoses and procedures">
  <div class="field-grid">
    <Field label="Pre-operative diagnosis" class="field-span-2">
      <TextInput
        label="Pre-operative diagnosis"
        bind:value={store.data.diagnosesAndProcedures.preOperativeDiagnosis}
      />
    </Field>
    <Field label="Post-operative diagnosis" class="field-span-2">
      <TextInput
        label="Post-operative diagnosis"
        bind:value={store.data.diagnosesAndProcedures.postOperativeDiagnosis}
      />
    </Field>
    <Field label="Planned procedure(s)" class="field-span-2">
      <TextAreaInput
        label="Planned procedure(s)"
        rows={2}
        bind:value={store.data.diagnosesAndProcedures.plannedProcedures}
      />
    </Field>
    <Field
      label="Procedure(s) actually performed"
      class="field-span-2"
      inputId="step-4-performed-procedures"
      error={store.errors['step-4-performed-procedures']}
    >
      <TextAreaInput
        id="step-4-performed-procedures"
        label="Procedure(s) actually performed"
        rows={2}
        bind:value={store.data.diagnosesAndProcedures.performedProcedures}
        aria-invalid={store.errors['step-4-performed-procedures'] ? 'true' : undefined}
      />
    </Field>
    <Field label="OPCS-4 codes" class="field-span-2">
      <TextInput
        label="OPCS-4 codes"
        bind:value={store.data.diagnosesAndProcedures.opcs4Codes}
      />
    </Field>
    <Field label="Urgency (NCEPOD)">
      <Select label="Urgency (NCEPOD)" bind:value={store.data.diagnosesAndProcedures.urgency}>
        <option value="">—</option>
        <option value="elective">Elective</option>
        <option value="scheduled">Scheduled</option>
        <option value="urgent">Urgent</option>
        <option value="immediate">Immediate</option>
      </Select>
    </Field>
    <Field label="Laterality">
      <Select label="Laterality" bind:value={store.data.diagnosesAndProcedures.laterality}>
        <option value="">—</option>
        <option value="left">Left</option>
        <option value="right">Right</option>
        <option value="bilateral">Bilateral</option>
        <option value="midline">Midline</option>
        <option value="na">N/A</option>
      </Select>
    </Field>
    <Field label="Indication" class="field-span-2">
      <TextInput label="Indication" bind:value={store.data.diagnosesAndProcedures.indication} />
    </Field>
  </div>
</Fieldset>
