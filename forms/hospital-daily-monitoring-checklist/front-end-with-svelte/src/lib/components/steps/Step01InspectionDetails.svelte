<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
</script>

<Fieldset legend="Step 1 — Inspection details">
  <p class="hint">
    Record the hospital or site, the department or site visited (if narrower
    than the whole hospital), the inspection date, and the inspecting
    officer's name and designation.
  </p>

  <div class="field-grid">
    <Field label="Hospital / facility name" inputId="hospitalName">
      <TextInput
        id="hospitalName"
        label="Hospital / facility name"
        bind:value={store.data.inspectionDetails.hospitalName}
      />
    </Field>
    <Field label="Department / site visited" inputId="departmentOrSite">
      <TextInput
        id="departmentOrSite"
        label="Department / site visited"
        bind:value={store.data.inspectionDetails.departmentOrSite}
      />
    </Field>
    <Field label="Inspection date" inputId="inspectionDate">
      <DateInput
        id="inspectionDate"
        label="Inspection date"
        bind:value={store.data.inspectionDetails.inspectionDate}
      />
    </Field>
    <Field label="Inspecting officer name" inputId="inspectingOfficerName">
      <TextInput
        id="inspectingOfficerName"
        label="Inspecting officer name"
        bind:value={store.data.inspectionDetails.inspectingOfficerName}
      />
    </Field>
    <Field label="Inspecting officer designation" inputId="inspectingOfficerDesignation">
      <TextInput
        id="inspectingOfficerDesignation"
        label="Inspecting officer designation"
        placeholder="e.g. Resident Medical Officer, Medical Superintendent"
        bind:value={store.data.inspectionDetails.inspectingOfficerDesignation}
      />
    </Field>
  </div>
</Fieldset>

<style>
  .field-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
  @media (max-width: 640px) {
    .field-grid { grid-template-columns: 1fr; }
  }
</style>
