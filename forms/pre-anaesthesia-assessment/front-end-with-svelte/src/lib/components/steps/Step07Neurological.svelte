<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 7 — Neurological and cognition">
  <div class="field-grid field-grid-3">
    <Field label="GCS total (3-15)">
      <NumberInput label="GCS total (3-15)" min={3} max={15} bind:value={store.data.neurological.gcsTotal} />
    </Field>
    <Field label="Cognitive tool">
      <Select label="Cognitive tool" bind:value={store.data.neurological.cognitionTool}>
        <option value="">—</option>
        <option value="AMT-4">AMT-4</option>
        <option value="MOCA">MOCA</option>
        <option value="MMSE">MMSE</option>
        <option value="none">None</option>
      </Select>
    </Field>
    <Field label="Cognitive score">
      <NumberInput label="Cognitive score" bind:value={store.data.neurological.cognitionScore} />
    </Field>
    <Field label="Cognitive impairment">
      <Select label="Cognitive impairment" bind:value={store.data.neurological.cognitiveImpairment}>
        <option value="">—</option>
        <option value="none">None</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
      </Select>
    </Field>
    <Field label="Capacity concern">
      <Select label="Capacity concern" bind:value={store.data.neurological.capacityConcern}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Recent stroke/TIA">
      <Select label="Recent stroke/TIA" bind:value={store.data.neurological.recentStrokeTia}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Days since stroke/TIA">
      <NumberInput label="Days since stroke/TIA" bind:value={store.data.neurological.daysSinceStrokeTia} />
    </Field>
  </div>
</Fieldset>
