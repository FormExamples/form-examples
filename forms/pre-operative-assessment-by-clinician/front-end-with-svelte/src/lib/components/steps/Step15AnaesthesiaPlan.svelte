<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 15 — Anaesthesia and post-op plan">
  <div class="field-grid">
    <Field label="Technique">
      <Select label="Technique" bind:value={store.data.anaesthesiaPlan.technique}>
        <option value="">—</option>
        <option value="ga">GA</option>
        <option value="regional">Regional</option>
        <option value="neuraxial">Neuraxial</option>
        <option value="sedation">Sedation</option>
        <option value="mac">MAC</option>
        <option value="local">Local</option>
        <option value="combined-ga-regional">Combined GA + regional</option>
      </Select>
    </Field>
    <Field label="Airway plan">
      <Select label="Airway plan" bind:value={store.data.anaesthesiaPlan.airwayPlan}>
        <option value="">—</option>
        <option value="face-mask">Face mask</option>
        <option value="supraglottic">Supraglottic</option>
        <option value="ett">ETT</option>
        <option value="awake-fibreoptic">Awake fibreoptic</option>
      </Select>
    </Field>
    <Field label="RSI planned?">
      <Select label="RSI planned?" bind:value={store.data.anaesthesiaPlan.rsiPlanned}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Monitoring">
      <Select label="Monitoring" bind:value={store.data.anaesthesiaPlan.monitoringLevel}>
        <option value="">—</option>
        <option value="standard">Standard</option>
        <option value="invasive-arterial">Arterial line</option>
        <option value="invasive-cvc">CVC</option>
        <option value="cardiac-output">Cardiac output</option>
      </Select>
    </Field>
    <Field label="Analgesia plan" class="field-span-2">
      <TextInput label="Analgesia plan" bind:value={store.data.anaesthesiaPlan.analgesiaPlan} />
    </Field>
    <Field label="DVT prophylaxis">
      <TextInput label="DVT prophylaxis" bind:value={store.data.anaesthesiaPlan.dvtProphylaxis} />
    </Field>
    <Field label="Antibiotic prophylaxis">
      <TextInput label="Antibiotic prophylaxis" bind:value={store.data.anaesthesiaPlan.antibioticProphylaxis} />
    </Field>
    <Field label="Disposition">
      <Select label="Disposition" bind:value={store.data.anaesthesiaPlan.postOpDisposition}>
        <option value="">—</option>
        <option value="day-case">Day case</option>
        <option value="ward">Ward</option>
        <option value="enhanced-care">Enhanced care</option>
        <option value="hdu">HDU</option>
        <option value="icu">ICU</option>
      </Select>
    </Field>
    <Field label="LOS (days)">
      <NumberInput label="LOS (days)" bind:value={store.data.anaesthesiaPlan.anticipatedLengthOfStayDays} />
    </Field>
  </div>
</Fieldset>
