<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';

  const rf = assessment.data.renalFunction;
</script>

<Fieldset legend="Step 6 \u2014 Renal function">
  <p class="hint">Kidney function markers used in PREVENT risk estimation.</p>

  <Field label="eGFR (mL/min/1.73m\u00b2)" inputId="step-6-egfr">
    <NumberInput id="step-6-egfr" label="eGFR" min={1} max={200} bind:value={rf.egfr} />
  </Field>

  <Field label="Creatinine (mg/dL)" inputId="step-6-creatinine">
    <NumberInput
      id="step-6-creatinine"
      label="Creatinine"
      min={0.1}
      max={30}
      step="0.1"
      bind:value={rf.creatinine}
    />
  </Field>

  <Field label="Urine ACR (mg/g)" inputId="step-6-urineAcr">
    <NumberInput id="step-6-urineAcr" label="Urine ACR" min={0} max={5000} bind:value={rf.urineAcr} />
  </Field>

  <Field label="CKD stage" inputId="step-6-ckdStage">
    <Select id="step-6-ckdStage" label="CKD stage" bind:value={rf.ckdStage}>
      <option value="">\u2014 Select \u2014</option>
      <option value="1">Stage 1 (eGFR &gt;= 90)</option>
      <option value="2">Stage 2 (eGFR 60\u201389)</option>
      <option value="3a">Stage 3a (eGFR 45\u201359)</option>
      <option value="3b">Stage 3b (eGFR 30\u201344)</option>
      <option value="4">Stage 4 (eGFR 15\u201329)</option>
      <option value="5">Stage 5 (eGFR &lt; 15)</option>
    </Select>
  </Field>
</Fieldset>
