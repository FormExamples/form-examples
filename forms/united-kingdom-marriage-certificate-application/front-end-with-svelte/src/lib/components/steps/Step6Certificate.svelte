<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const v = assessment.data.certificate;
</script>

<Fieldset legend="Step 6 of 6 — Marriage certificate order">
  <p class="hint">
    Optionally order copies of the marriage certificate from the General Register Office (GRO).
  </p>

  <Field label="Number of certificate copies" inputId="certificate-certificateCopies">
    <NumberInput
      id="certificate-certificateCopies"
      label="Number of certificate copies"
      min={0}
      bind:value={v.certificateCopies}
    />
  </Field>

  <Field label="GRO service" inputId="certificate-certificateService">
    <Select
      id="certificate-certificateService"
      label="GRO service"
      bind:value={v.certificateService}
    >
      <option value="">— Select —</option>
      <option value="standard">Standard</option>
      <option value="priority">Priority (sent next working day if ordered by 4pm)</option>
    </Select>
  </Field>

  <Field label="GRO index reference" inputId="certificate-groIndexReference">
    <TextInput
      id="certificate-groIndexReference"
      label="GRO index reference"
      bind:value={v.groIndexReference}
    />
  </Field>

  <Field label="Note" inputId="certificate-applicantNote">
    <TextInput id="certificate-applicantNote" label="Note" bind:value={v.applicantNote} />
  </Field>
</Fieldset>
