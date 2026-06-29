<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 14 — Functional capacity and frailty">
  <div class="field-grid field-grid-3">
    <Field label="METs">
      <NumberInput label="METs" step="0.1" bind:value={store.data.functionalCapacity.metsEstimate} />
    </Field>
    <Field label="DASI score">
      <NumberInput label="DASI score" step="0.1" bind:value={store.data.functionalCapacity.dasiScore} />
    </Field>
    <Field label="Clinical Frailty Scale (1-9)">
      <NumberInput label="Clinical Frailty Scale (1-9)" min={1} max={9} bind:value={store.data.functionalCapacity.clinicalFrailtyScale} />
    </Field>
    <Field label="ECOG (0-4)">
      <NumberInput label="ECOG (0-4)" min={0} max={4} bind:value={store.data.functionalCapacity.ecogPerformanceStatus} />
    </Field>
    <Field label="6-min walk (m)">
      <NumberInput label="6-min walk (m)" bind:value={store.data.functionalCapacity.sixMinuteWalkMetres} />
    </Field>
    <Field label="CPET performed">
      <Select label="CPET performed" bind:value={store.data.functionalCapacity.cpetPerformed}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="CPET VO2 peak">
      <NumberInput label="CPET VO2 peak" step="0.1" bind:value={store.data.functionalCapacity.cpetVo2PeakMlKgMin} />
    </Field>
    <Field label="AT (mL/kg/min)">
      <NumberInput label="AT (mL/kg/min)" step="0.1" bind:value={store.data.functionalCapacity.cpetAnaerobicThresholdMlKgMin} />
    </Field>
    <Field label="Malnutrition risk">
      <Select label="Malnutrition risk" bind:value={store.data.functionalCapacity.malnutritionRisk}>
        <option value="">—</option>
        <option value="none">None</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </Select>
    </Field>
  </div>
</Fieldset>
