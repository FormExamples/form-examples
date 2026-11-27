<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import { CheckboxInput, TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.sample;
</script>

<Fieldset legend="Step 6 of 7 · Sample collection">
  <p class="hint">
    Samples and forms need a minimum of 3 matching identifiers; samples labelled incorrectly are
    discarded.
  </p>

  <div class="field-grid">
    <Field label="Collected by" inputId="sample-sampleCollectorName">
      <TextInput
        id="sample-sampleCollectorName"
        label="Collected by"
        bind:value={d.sampleCollectorName}
      />
    </Field>
    <Field label="Collected at" inputId="sample-sampleCollectedAt">
      <TextInput
        id="sample-sampleCollectedAt"
        label="Collected at"
        type="datetime-local"
        bind:value={d.sampleCollectedAt}
      />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Identifiers on sample labels" inputId="sample-identifiersOnSampleCount">
      <NumberInput
        id="sample-identifiersOnSampleCount"
        label="Identifiers on sample labels"
        min={0}
        max={10}
        bind:value={d.identifiersOnSampleCount}
      />
    </Field>
    <Field label="Identifiers on request form" inputId="sample-identifiersOnFormCount">
      <NumberInput
        id="sample-identifiersOnFormCount"
        label="Identifiers on request form"
        min={0}
        max={10}
        bind:value={d.identifiersOnFormCount}
      />
    </Field>
  </div>

  <label class="bool-field">
    <CheckboxInput
      id="sample-sampleAndFormDetailsMatch"
      label="Sample and form details match"
      bind:checked={d.sampleAndFormDetailsMatch}
    />
    <span>Sample and form details match</span>
  </label>

  <h3 class="subhead">Tubes sent</h3>

  <div class="field-grid">
    <Field label="Purple EDTA tubes (addressograph)" inputId="sample-samplesEdtaPurpleCount">
      <NumberInput
        id="sample-samplesEdtaPurpleCount"
        label="Purple EDTA tubes (addressograph)"
        min={0}
        max={20}
        bind:value={d.samplesEdtaPurpleCount}
      />
    </Field>
    <Field
      label="Pink EDTA tubes (hand-labelled)"
      inputId="sample-samplesEdtaPinkHandLabelledCount"
    >
      <NumberInput
        id="sample-samplesEdtaPinkHandLabelledCount"
        label="Pink EDTA tubes (hand-labelled)"
        min={0}
        max={20}
        bind:value={d.samplesEdtaPinkHandLabelledCount}
      />
    </Field>
  </div>

  <Field label="Serum tubes (red or gold)" inputId="sample-samplesSerumCount">
    <NumberInput
      id="sample-samplesSerumCount"
      label="Serum tubes (red or gold)"
      min={0}
      max={20}
      bind:value={d.samplesSerumCount}
    />
  </Field>
</Fieldset>

<style>
  .field-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
  @media (max-width: 640px) {
    .field-grid {
      grid-template-columns: 1fr;
    }
  }
  .subhead {
    margin: 1rem 0 0.25rem;
    font-weight: 600;
  }
  .bool-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
