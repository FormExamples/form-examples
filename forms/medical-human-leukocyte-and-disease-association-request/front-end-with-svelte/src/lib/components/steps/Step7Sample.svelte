<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import { CheckboxInput, TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.sample;
</script>

<Fieldset legend="Step 7 of 8 · Sample collection">
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
    <Field label="Identifiers on sample label" inputId="sample-identifiersOnSampleCount">
      <NumberInput
        id="sample-identifiersOnSampleCount"
        label="Identifiers on sample label"
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

  <div class="field-grid">
    <Field label="EDTA blood volume (mL)" inputId="sample-sampleVolumeMl">
      <NumberInput
        id="sample-sampleVolumeMl"
        label="EDTA blood volume (mL)"
        min={0}
        max={50}
        bind:value={d.sampleVolumeMl}
      />
    </Field>
    <Field label="Other samples sent (if any)" inputId="sample-samplesOtherDescription">
      <TextInput
        id="sample-samplesOtherDescription"
        label="Other samples sent (if any)"
        bind:value={d.samplesOtherDescription}
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
  .bool-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  @media (max-width: 640px) {
    .field-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
