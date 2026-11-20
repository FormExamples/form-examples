<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const g = assessment.data.progress;
</script>

<Fieldset legend="Step 7 of 7 — Progress and dates">
  <p class="hint">
    Dates the court has given you. The 20-week and 6-weeks-and-1-day waits run from these.
  </p>

  <Field label="Date the court issued the application" inputId="progress-applicationIssuedDate">
    <DateInput
      id="progress-applicationIssuedDate"
      label="Date the court issued the application"
      bind:value={g.applicationIssuedDate}
    />
  </Field>
  <p class="hint">A conditional order can be applied for 20 weeks after this date.</p>

  <Field
    label="Has your spouse returned the acknowledgement of service?"
    inputId="progress-respondentAcknowledged"
  >
    <Select
      id="progress-respondentAcknowledged"
      label="Has your spouse returned the acknowledgement of service?"
      bind:value={g.respondentAcknowledged}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">Sole applications only; they have 14 days to respond.</p>

  <Field label="Date the conditional order was made" inputId="progress-conditionalOrderGrantedDate">
    <DateInput
      id="progress-conditionalOrderGrantedDate"
      label="Date the conditional order was made"
      bind:value={g.conditionalOrderGrantedDate}
    />
  </Field>
  <p class="hint">A final order can be applied for 6 weeks and 1 day (43 days) after this date.</p>

  <Field
    label="Is any delay of more than 12 months since the conditional order explained?"
    inputId="progress-finalOrderDelayExplained"
  >
    <Select
      id="progress-finalOrderDelayExplained"
      label="Is any delay of more than 12 months since the conditional order explained?"
      bind:value={g.finalOrderDelayExplained}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
