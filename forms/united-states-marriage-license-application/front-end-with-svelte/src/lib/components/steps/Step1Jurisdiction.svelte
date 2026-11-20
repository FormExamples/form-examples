<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import { US_STATES } from '#lib/engine/utils.js';

  const v = assessment.data.jurisdiction;
</script>

<Fieldset legend="Step 1 of 6 — Issuing jurisdiction">
  <p class="hint">
    Marriage law is set by each state, and a county clerk issues the license. Choose the state and
    county where you will apply.
  </p>

  <Field label="State" inputId="jurisdiction-state">
    <Select id="jurisdiction-state" label="State" bind:value={v.state}>
      <option value="">— Select —</option>
      {#each US_STATES as [code, stateName] (code)}
        <option value={code}>{stateName} ({code})</option>
      {/each}
    </Select>
  </Field>
  <Field label="County (or clerk jurisdiction)" inputId="jurisdiction-county">
    <TextInput
      id="jurisdiction-county"
      label="County (or clerk jurisdiction)"
      placeholder="e.g. Los Angeles County"
      bind:value={v.county}
    />
  </Field>
  <Field label="Date of application" inputId="jurisdiction-applicationDate">
    <DateInput
      id="jurisdiction-applicationDate"
      label="Date of application"
      bind:value={v.applicationDate}
    />
  </Field>
  <Field label="License type" inputId="jurisdiction-licenseType">
    <Select id="jurisdiction-licenseType" label="License type" bind:value={v.licenseType}>
      <option value="">— Select —</option>
      <option value="standard">Standard (public) license</option>
      <option value="confidential">Confidential license</option>
    </Select>
  </Field>
</Fieldset>
