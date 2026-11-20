<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';

  const w = assessment.data.wishes;
</script>

<Fieldset legend="Step 4 of 6 — Treatment wishes">
  <p class="hint">
    Guidance for the agent and clinicians. A power of attorney is not a medical order; a POLST is.
  </p>

  <Field label="Life-sustaining treatment" inputId="wishes-lifeSustainingTreatment">
    <Select
      id="wishes-lifeSustainingTreatment"
      label="Life-sustaining treatment"
      bind:value={w.lifeSustainingTreatment}
    >
      <option value="">— Select —</option>
      <option value="refuse"
        >Refuse life-sustaining treatment if terminal or permanently unconscious</option
      >
      <option value="time-limited-trial"
        >Accept a time-limited trial, then stop if no improvement</option
      >
      <option value="want-all">Want all available treatment</option>
      <option value="agent-decides">Leave it to my agent</option>
    </Select>
  </Field>
  <Field label="CPR (cardiopulmonary resuscitation)" inputId="wishes-cpr">
    <Select id="wishes-cpr" label="CPR (cardiopulmonary resuscitation)" bind:value={w.cpr}>
      <option value="">— Select —</option>
      <option value="accept">Accept</option>
      <option value="refuse">Refuse</option>
      <option value="agent-decides">Agent decides</option>
    </Select>
  </Field>
  <Field label="Ventilator (breathing machine)" inputId="wishes-ventilator">
    <Select id="wishes-ventilator" label="Ventilator (breathing machine)" bind:value={w.ventilator}>
      <option value="">— Select —</option>
      <option value="accept">Accept</option>
      <option value="refuse">Refuse</option>
      <option value="agent-decides">Agent decides</option>
    </Select>
  </Field>
  <Field label="Artificial nutrition and hydration" inputId="wishes-artificialNutrition">
    <Select
      id="wishes-artificialNutrition"
      label="Artificial nutrition and hydration"
      bind:value={w.artificialNutrition}
    >
      <option value="">— Select —</option>
      <option value="accept">Accept</option>
      <option value="refuse">Refuse</option>
      <option value="agent-decides">Agent decides</option>
    </Select>
  </Field>
  <Field label="Prioritize comfort and pain relief?" inputId="wishes-comfortCareFirst">
    <Select
      id="wishes-comfortCareFirst"
      label="Prioritize comfort and pain relief?"
      bind:value={w.comfortCareFirst}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Does the principal have a serious illness or frailty?"
    inputId="wishes-seriousIllness"
  >
    <Select
      id="wishes-seriousIllness"
      label="Does the principal have a serious illness or frailty?"
      bind:value={w.seriousIllness}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">A POLST is for people with serious illness or frailty.</p>
  <Field label="POLST status" inputId="wishes-polstStatus">
    <Select id="wishes-polstStatus" label="POLST status" bind:value={w.polstStatus}>
      <option value="">— Select —</option>
      <option value="none">No POLST</option>
      <option value="in-place">A POLST is in place</option>
      <option value="discussing">Discussing a POLST with my clinician</option>
    </Select>
  </Field>
  <Field label="Other wishes or values" inputId="wishes-wishesNote">
    <TextAreaInput
      id="wishes-wishesNote"
      label="Other wishes or values"
      rows={3}
      placeholder="What matters most to you, in your own words."
      bind:value={w.wishesNote}
    />
  </Field>
</Fieldset>
