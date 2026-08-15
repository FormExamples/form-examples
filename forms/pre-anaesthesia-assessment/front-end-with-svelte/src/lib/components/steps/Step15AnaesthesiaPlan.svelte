<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
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
    <Field label="VTE risk assessment">
      <Select label="VTE risk assessment" bind:value={store.data.anaesthesiaPlan.vteRiskLevel}>
        <option value="">—</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </Select>
    </Field>
    <Field label="COVID-19 screening / PCR">
      <Select label="COVID-19 screening / PCR" bind:value={store.data.anaesthesiaPlan.covidScreeningResult}>
        <option value="">—</option>
        <option value="not-tested">Not tested</option>
        <option value="negative">Negative</option>
        <option value="positive">Positive</option>
        <option value="pending">Pending</option>
      </Select>
    </Field>
  </div>

  <h3 class="step-subhead">Discharge planning</h3>
  <div class="field-grid">
    <Field label="Planned discharge destination">
      <Select label="Planned discharge destination" bind:value={store.data.anaesthesiaPlan.dischargeDestination}>
        <option value="">—</option>
        <option value="home">Home</option>
        <option value="home-with-support">Home with support</option>
        <option value="residential-care">Residential care</option>
        <option value="nursing-home">Nursing home</option>
        <option value="rehabilitation">Rehabilitation</option>
        <option value="other">Other</option>
      </Select>
    </Field>
    <Field label="Social services involvement">
      <Select label="Social services involvement" bind:value={store.data.anaesthesiaPlan.socialServicesInvolvement}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Reablement / physiotherapy needs">
      <Select
        label="Reablement / physiotherapy needs"
        bind:value={store.data.anaesthesiaPlan.reablementPhysiotherapyNeeds}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Follow-up requirements" class="field-span-2">
      <TextInput label="Follow-up requirements" bind:value={store.data.anaesthesiaPlan.followUpRequirements} />
    </Field>
  </div>
</Fieldset>
