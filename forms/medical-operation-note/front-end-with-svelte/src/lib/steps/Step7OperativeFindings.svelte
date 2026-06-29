<script lang="ts">
  import { store } from '$lib/state.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 7 — Operative findings and technique">
  <div class="field-grid">
    <Field label="Numbered step-by-step technique" class="field-span-2">
      <TextAreaInput
        label="Numbered step-by-step technique"
        rows={6}
        bind:value={store.data.operativeFindings.techniqueSteps}
      />
    </Field>
    <Field label="Pathology found" class="field-span-2">
      <TextAreaInput
        label="Pathology found"
        rows={3}
        bind:value={store.data.operativeFindings.pathologyFound}
      />
    </Field>
    <Field label="Anatomical anomalies" class="field-span-2">
      <TextAreaInput
        label="Anatomical anomalies"
        rows={2}
        bind:value={store.data.operativeFindings.anatomicalAnomalies}
      />
    </Field>
    <Field label="Intra-operative photographs taken">
      <Select label="Intra-operative photographs taken" bind:value={store.data.operativeFindings.intraOpPhotographsTaken}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Frozen-section requested">
      <Select label="Frozen-section requested" bind:value={store.data.operativeFindings.frozenSectionRequested}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
  </div>
</Fieldset>
