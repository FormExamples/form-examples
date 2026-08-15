<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 10 — Endocrine">
  <div class="field-grid field-grid-3">
    <Field label="Diabetes type">
      <Select label="Diabetes type" bind:value={store.data.endocrine.diabetesType}>
        <option value="">—</option>
        <option value="none">None</option>
        <option value="type-1">Type 1</option>
        <option value="type-2">Type 2</option>
        <option value="gestational">Gestational</option>
        <option value="other">Other</option>
      </Select>
    </Field>
    <Field label="On insulin?">
      <Select label="On insulin?" bind:value={store.data.endocrine.diabetesOnInsulin}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="HbA1c (mmol/mol)">
      <NumberInput label="HbA1c (mmol/mol)" bind:value={store.data.endocrine.hba1cMmolMol} />
    </Field>
    <Field label="Fasting glucose (mmol/L)">
      <NumberInput label="Fasting glucose (mmol/L)" step="0.1" bind:value={store.data.endocrine.fastingGlucoseMmolL} />
    </Field>
    <Field label="Control">
      <Select label="Control" bind:value={store.data.endocrine.diabetesControl}>
        <option value="">—</option>
        <option value="well-controlled">Well-controlled</option>
        <option value="suboptimal">Suboptimal</option>
        <option value="poor">Poor</option>
      </Select>
    </Field>
    <Field label="Thyroid">
      <Select label="Thyroid" bind:value={store.data.endocrine.thyroidStatus}>
        <option value="">—</option>
        <option value="euthyroid">Euthyroid</option>
        <option value="hypothyroid">Hypothyroid</option>
        <option value="hyperthyroid">Hyperthyroid</option>
      </Select>
    </Field>
    <Field label="Long-term steroids?">
      <Select label="Long-term steroids?" bind:value={store.data.endocrine.onLongTermSteroids}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Steroid dose (mg prednisolone-eq.)">
      <NumberInput label="Steroid dose (mg prednisolone-eq.)" step="0.1" bind:value={store.data.endocrine.steroidDoseMg} />
    </Field>
    <Field label="Steroid cover plan" class="field-span-3">
      <TextInput label="Steroid cover plan" bind:value={store.data.endocrine.steroidCoverPlan} />
    </Field>
  </div>
</Fieldset>
