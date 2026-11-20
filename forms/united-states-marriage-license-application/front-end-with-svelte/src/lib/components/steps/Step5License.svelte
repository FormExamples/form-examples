<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const v = assessment.data.issuance;
</script>

<Fieldset legend="Step 5 of 6 — License issuance and fee">
  <p class="hint">
    When the clerk issued the license, and the fee paid. The waiting period and validity period run
    from the issue date.
  </p>

  <Field label="License issue date" inputId="issuance-licenseIssuedDate">
    <DateInput
      id="issuance-licenseIssuedDate"
      label="License issue date"
      bind:value={v.licenseIssuedDate}
    />
  </Field>
  <Field label="Fee paid (US dollars)" inputId="issuance-feePaidUsd">
    <NumberInput
      id="issuance-feePaidUsd"
      label="Fee paid (US dollars)"
      min={0}
      bind:value={v.feePaidUsd}
    />
  </Field>
  <Field label="Note" inputId="issuance-clerkNote">
    <TextAreaInput id="issuance-clerkNote" label="Note" rows={3} bind:value={v.clerkNote} />
  </Field>
</Fieldset>
