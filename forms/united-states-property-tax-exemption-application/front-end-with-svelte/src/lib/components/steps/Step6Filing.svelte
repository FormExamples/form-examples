<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const s = assessment.data.filing;
</script>

<Fieldset legend="Step 6 of 8 — Filing and deadline">
  <p class="hint">
    The assessment year and the date you file. The state deadline is derived from the state rule.
  </p>

  <Field label="Assessment (tax) year the exemption is for" inputId="filing-assessmentYear">
    <NumberInput
      id="filing-assessmentYear"
      label="Assessment (tax) year the exemption is for"
      bind:value={s.assessmentYear}
    />
  </Field>

  <Field label="Filing date" inputId="filing-filingDate">
    <DateInput id="filing-filingDate" label="Filing date" bind:value={s.filingDate} />
  </Field>

  <Field label="Application type" inputId="filing-applicationType">
    <Select id="filing-applicationType" label="Application type" bind:value={s.applicationType}>
      <option value="">— Select —</option>
      <option value="initial">Initial application</option>
      <option value="renewal">Renewal</option>
      <option value="late">Late filing (relief requested)</option>
    </Select>
  </Field>
</Fieldset>
