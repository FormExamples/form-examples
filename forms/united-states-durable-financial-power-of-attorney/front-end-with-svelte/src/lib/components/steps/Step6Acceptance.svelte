<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const ac = assessment.data.acceptance;
</script>

<Fieldset legend="Step 6 of 6 — Acceptance and use">
  <p class="hint">
    Banks, county recorders, and the IRS each have their own acceptance practices. A durable power
    does not by itself authorize representation before the IRS.
  </p>

  <Field
    label="Will the instrument be recorded for a real-estate transaction?"
    inputId="acceptance-usedForRealEstate"
  >
    <Select
      id="acceptance-usedForRealEstate"
      label="Will the instrument be recorded for a real-estate transaction?"
      bind:value={ac.usedForRealEstate}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Financial institution’s own POA form" inputId="acceptance-bankFormCompleted">
    <Select
      id="acceptance-bankFormCompleted"
      label="Financial institution’s own POA form"
      bind:value={ac.bankFormCompleted}
    >
      <option value="">— Select —</option>
      <option value="yes">Completed</option>
      <option value="no">Not completed</option>
      <option value="not-needed">Not needed</option>
    </Select>
  </Field>
  <Field label="IRS Form 2848 status" inputId="acceptance-form2848Status">
    <Select
      id="acceptance-form2848Status"
      label="IRS Form 2848 status"
      bind:value={ac.form2848Status}
    >
      <option value="">— Select —</option>
      <option value="filed">Filed or attached</option>
      <option value="not-filed">Not filed</option>
      <option value="not-needed">Not needed</option>
    </Select>
  </Field>
</Fieldset>
