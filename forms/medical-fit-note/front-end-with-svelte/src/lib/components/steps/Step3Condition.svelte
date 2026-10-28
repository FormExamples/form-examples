<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';
</script>

<Fieldset legend="Step 3 of 8 — Condition" id="step-3-legend">
  <p class="hint">The diagnosis the advice is based on (rule R-02) and its functional effects.</p>
  <Field label="Primary diagnosis" inputId="step-3-diagnosis-primary">
    <TextInput
      id="step-3-diagnosis-primary"
      label="Primary diagnosis"
      bind:value={store.data.diagnosisPrimary}
    />
  </Field>
  <Field label="Additional diagnoses" inputId="step-3-diagnosis-additional">
    <TextInput
      id="step-3-diagnosis-additional"
      label="Additional diagnoses"
      bind:value={store.data.diagnosisAdditional}
    />
  </Field>
  <Field label="Functional effects" inputId="step-3-functional-effects">
    <TextAreaInput
      id="step-3-functional-effects"
      label="Functional effects"
      rows={3}
      placeholder="How the condition affects the employee at work."
      bind:value={store.data.functionalEffects}
    />
  </Field>
</Fieldset>
