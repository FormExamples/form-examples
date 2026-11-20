<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const j = assessment.data.jurisdiction;
</script>

<Fieldset legend="Step 3 of 7 — Jurisdiction">
  <p class="hint">
    The courts of England and Wales can hear the case only if a residence or domicile ground is met.
  </p>

  <Field
    label="Are you habitually resident in England and Wales?"
    inputId="jurisdiction-applicantHabitualResident"
  >
    <Select
      id="jurisdiction-applicantHabitualResident"
      label="Are you habitually resident in England and Wales?"
      bind:value={j.applicantHabitualResident}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Months you have been habitually resident there"
    inputId="jurisdiction-applicantResidenceMonths"
  >
    <NumberInput
      id="jurisdiction-applicantResidenceMonths"
      label="Months you have been habitually resident there"
      min={0}
      max={1200}
      bind:value={j.applicantResidenceMonths}
    />
  </Field>
  <p class="hint">
    12 months, or 6 months if you are also domiciled there, is enough for a sole application.
  </p>

  <Field label="Are you domiciled in England and Wales?" inputId="jurisdiction-applicantDomiciled">
    <Select
      id="jurisdiction-applicantDomiciled"
      label="Are you domiciled in England and Wales?"
      bind:value={j.applicantDomiciled}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Is your spouse or civil partner habitually resident in England and Wales?"
    inputId="jurisdiction-respondentHabitualResident"
  >
    <Select
      id="jurisdiction-respondentHabitualResident"
      label="Is your spouse or civil partner habitually resident in England and Wales?"
      bind:value={j.respondentHabitualResident}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Is your spouse or civil partner domiciled in England and Wales?"
    inputId="jurisdiction-respondentDomiciled"
  >
    <Select
      id="jurisdiction-respondentDomiciled"
      label="Is your spouse or civil partner domiciled in England and Wales?"
      bind:value={j.respondentDomiciled}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Were you both last habitually resident there, and does one of you still live there?"
    inputId="jurisdiction-lastHabituallyResidentTogether"
  >
    <Select
      id="jurisdiction-lastHabituallyResidentTogether"
      label="Were you both last habitually resident there, and does one of you still live there?"
      bind:value={j.lastHabituallyResidentTogether}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
