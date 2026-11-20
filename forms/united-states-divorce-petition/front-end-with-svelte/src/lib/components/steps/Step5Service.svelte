<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const sv = assessment.data.service;
</script>

<Fieldset legend="Step 5 of 6 — Service of process">
  <p class="hint">
    How and when the respondent is served, and whether the respondent has responded.
  </p>

  <Field label="Service method" inputId="service-serviceMethod">
    <Select id="service-serviceMethod" label="Service method" bind:value={sv.serviceMethod}>
      <option value="">— Select —</option>
      <option value="personal">Personal service by a process server or sheriff</option>
      <option value="acceptance">Acceptance or waiver of service signed by the respondent</option>
      <option value="mail">Certified mail with return receipt</option>
      <option value="publication">Service by publication</option>
      <option value="none">Not yet served</option>
    </Select>
  </Field>

  <Field label="Date served or acceptance signed" inputId="service-serviceDate">
    <DateInput
      id="service-serviceDate"
      label="Date served or acceptance signed"
      bind:value={sv.serviceDate}
    />
  </Field>

  <Field
    label="Has the respondent filed a response or appearance?"
    inputId="service-respondentResponded"
  >
    <Select
      id="service-respondentResponded"
      label="Has the respondent filed a response or appearance?"
      bind:value={sv.respondentResponded}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
