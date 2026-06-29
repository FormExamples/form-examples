<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';

  const d = assessment.data.renalFunction;
</script>

<Fieldset legend="Step 6 \u2014 Renal function">
  <p class="hint">Enter the most recent renal function test results.</p>

  <div class="field-grid">
    <Field label="eGFR (mL/min/1.73m\u00b2)" inputId="step-6-egfr">
      <NumberInput id="step-6-egfr" label="eGFR" min={0} max={200} bind:value={d.egfr} />
    </Field>
    <Field label="Creatinine (\u00b5mol/L)" inputId="step-6-creatinine">
      <NumberInput id="step-6-creatinine" label="Creatinine" min={0} max={2000} bind:value={d.creatinine} />
    </Field>
  </div>

  <Field label="Urine ACR (mg/mmol)" inputId="step-6-urineAcr">
    <NumberInput id="step-6-urineAcr" label="Urine ACR" min={0} step="0.1" bind:value={d.urineAcr} />
  </Field>

  <div class="field-grid">
    <Field label="Proteinuria status" inputId="step-6-proteinuria">
      <Select id="step-6-proteinuria" label="Proteinuria status" bind:value={d.proteinuria}>
        <option value="">\u2014 Select \u2014</option>
        <option value="none">None</option>
        <option value="microalbuminuria">Microalbuminuria (ACR 3\u201330 mg/mmol)</option>
        <option value="macroalbuminuria">Macroalbuminuria (ACR &gt;30 mg/mmol)</option>
      </Select>
    </Field>
    <Field label="CKD stage" inputId="step-6-ckdStage">
      <Select id="step-6-ckdStage" label="CKD stage" bind:value={d.ckdStage}>
        <option value="">\u2014 Select \u2014</option>
        <option value="G1">G1 (eGFR \u2265 90)</option>
        <option value="G2">G2 (eGFR 60\u201389)</option>
        <option value="G3a">G3a (eGFR 45\u201359)</option>
        <option value="G3b">G3b (eGFR 30\u201344)</option>
        <option value="G4">G4 (eGFR 15\u201329)</option>
        <option value="G5">G5 (eGFR &lt; 15)</option>
      </Select>
    </Field>
  </div>
</Fieldset>
