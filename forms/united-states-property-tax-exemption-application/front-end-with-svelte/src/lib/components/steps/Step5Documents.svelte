<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const s = assessment.data.documents;
</script>

<Fieldset legend="Step 5 of 8 — Proof documents">
  <p class="hint">
    Mark each document you are attaching. The documents required depend on the exemptions claimed.
  </p>

  <Field label="Proof of ownership (deed or tax bill)" inputId="documents-proofOfOwnership">
    <Select
      id="documents-proofOfOwnership"
      label="Proof of ownership (deed or tax bill)"
      bind:value={s.proofOfOwnership}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Proof of residency (driver licence, voter or vehicle registration)"
    inputId="documents-proofOfResidency"
  >
    <Select
      id="documents-proofOfResidency"
      label="Proof of residency (driver licence, voter or vehicle registration)"
      bind:value={s.proofOfResidency}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Proof of age" inputId="documents-proofOfAge">
    <Select id="documents-proofOfAge" label="Proof of age" bind:value={s.proofOfAge}>
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Proof of income (tax return or benefit letter)" inputId="documents-proofOfIncome">
    <Select
      id="documents-proofOfIncome"
      label="Proof of income (tax return or benefit letter)"
      bind:value={s.proofOfIncome}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Proof of disability or VA rating letter" inputId="documents-proofOfDisability">
    <Select
      id="documents-proofOfDisability"
      label="Proof of disability or VA rating letter"
      bind:value={s.proofOfDisability}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
