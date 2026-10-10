<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { DateInput, TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 3 — Assessor and assessment">
  <div class="field-grid">
    <Field label="Assessor name" inputId="step-3-assessor-name" error={store.errors['step-3-assessor-name']}>
      <TextInput
        id="step-3-assessor-name"
        label="Assessor name"
        bind:value={store.data.assessor.name}
        aria-invalid={store.errors['step-3-assessor-name'] ? 'true' : undefined}
      />
    </Field>
    <Field label="Assessor email">
      <TextInput label="Assessor email" bind:value={store.data.assessor.email} />
    </Field>
    <Field label="Assessor phone">
      <TextInput label="Assessor phone" bind:value={store.data.assessor.phone} />
    </Field>
    <Field label="Assessor organisation">
      <TextInput label="Assessor organisation" bind:value={store.data.assessor.organisation} />
    </Field>
    <Field label="Assessor role">
      <Select label="Assessor role" bind:value={store.data.assessor.role}>
        <option value="">—</option>
        <option value="commissioner">Commissioner</option>
        <option value="procurement-lead">Procurement lead</option>
        <option value="clinical-safety-officer">Clinical Safety Officer</option>
        <option value="information-governance-lead">Information governance lead</option>
        <option value="information-security-lead">Information security lead</option>
        <option value="digital-lead">Digital lead</option>
        <option value="other">Other</option>
      </Select>
    </Field>
    <Field label="Commissioning organisation">
      <TextInput label="Commissioning organisation" bind:value={store.data.assessment.commissioningOrganisation} />
    </Field>
    <Field label="DTAC version assessed against">
      <TextInput label="DTAC version" bind:value={store.data.assessment.dtacVersion} />
    </Field>
    <Field label="Assessment date" inputId="step-3-assessment-date" error={store.errors['step-3-assessment-date']}>
      <DateInput
        id="step-3-assessment-date"
        label="Assessment date"
        bind:value={() => store.data.assessment.assessmentDate ?? undefined, (v) => (store.data.assessment.assessmentDate = v || null)}
        aria-invalid={store.errors['step-3-assessment-date'] ? 'true' : undefined}
      />
    </Field>
    <Field label="Review due date">
      <DateInput label="Review due date" bind:value={() => store.data.assessment.reviewDueDate ?? undefined, (v) => (store.data.assessment.reviewDueDate = v || null)} />
    </Field>
    <Field label="Assessor notes" class="field-span-2">
      <TextAreaInput label="Assessor notes" rows={3} bind:value={store.data.assessment.assessorNotes} />
    </Field>
  </div>
</Fieldset>
