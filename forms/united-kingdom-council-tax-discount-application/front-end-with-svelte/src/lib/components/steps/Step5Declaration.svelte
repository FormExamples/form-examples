<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const d = assessment.data.declaration;
</script>

<Fieldset legend="Step 5 of 5 — Declaration">
  <p class="hint">
    Please read each statement and answer yes to confirm. Giving false information can lead to a
    penalty and prosecution.
  </p>

  <Field
    label="I declare that the information I have given is true and complete."
    inputId="declaration-declaredTrue"
  >
    <Select
      id="declaration-declaredTrue"
      label="I declare that the information I have given is true and complete."
      bind:value={d.declaredTrue}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="I will tell the council within 21 days of any change that affects this discount."
    inputId="declaration-agreesToReportChanges"
  >
    <Select
      id="declaration-agreesToReportChanges"
      label="I will tell the council within 21 days of any change that affects this discount."
      bind:value={d.agreesToReportChanges}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="I understand that false information can lead to a penalty and prosecution, and that a discount I should not have had must be repaid."
    inputId="declaration-fraudWarningAcknowledged"
  >
    <Select
      id="declaration-fraudWarningAcknowledged"
      label="I understand that false information can lead to a penalty and prosecution, and that a discount I should not have had must be repaid."
      bind:value={d.fraudWarningAcknowledged}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Your name (declaration)" inputId="declaration-declarantName">
    <TextInput
      id="declaration-declarantName"
      label="Your name (declaration)"
      bind:value={d.declarantName}
    />
  </Field>
  <Field label="Date of declaration" inputId="declaration-declarationDate">
    <DateInput
      id="declaration-declarationDate"
      label="Date of declaration"
      bind:value={d.declarationDate}
    />
  </Field>
</Fieldset>
