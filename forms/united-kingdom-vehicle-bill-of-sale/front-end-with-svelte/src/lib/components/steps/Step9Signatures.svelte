<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const p = assessment.data.signatures;
</script>

<Fieldset legend="Step 9 of 9 — Signatures">
  <p class="hint">Both parties sign and date the bill of sale, and each keeps a copy.</p>

  <Field label="Has the seller signed?" inputId="signatures-sellerSigned">
    <Select id="signatures-sellerSigned" label="Has the seller signed?" bind:value={p.sellerSigned}>
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Has the buyer signed?" inputId="signatures-buyerSigned">
    <Select id="signatures-buyerSigned" label="Has the buyer signed?" bind:value={p.buyerSigned}>
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Date signed" inputId="signatures-signatureDate">
    <DateInput id="signatures-signatureDate" label="Date signed" bind:value={p.signatureDate} />
  </Field>

  <Field label="Note" inputId="signatures-note">
    <TextAreaInput
      id="signatures-note"
      label="Note"
      rows={3}
      placeholder="Anything else the parties agreed."
      bind:value={p.note}
    />
  </Field>
</Fieldset>
