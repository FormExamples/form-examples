<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const pr = assessment.data.property;
</script>

<Fieldset legend="Step 4 of 6 — Property and settlement">
  <p class="hint">
    Community or equitable division, the settlement agreement, financial disclosure, and spousal
    support.
  </p>

  <Field label="Property-division approach pleaded" inputId="property-propertyDivisionApproach">
    <Select
      id="property-propertyDivisionApproach"
      label="Property-division approach pleaded"
      bind:value={pr.propertyDivisionApproach}
    >
      <option value="">— Select —</option>
      <option value="community">Community property</option>
      <option value="equitable">Equitable distribution</option>
    </Select>
  </Field>

  <Field
    label="Marital settlement agreement signed by both spouses?"
    inputId="property-settlementAgreementSigned"
  >
    <Select
      id="property-settlementAgreementSigned"
      label="Marital settlement agreement signed by both spouses?"
      bind:value={pr.settlementAgreementSigned}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Financial disclosure or affidavit filed or ready?"
    inputId="property-financialDisclosureFiled"
  >
    <Select
      id="property-financialDisclosureFiled"
      label="Financial disclosure or affidavit filed or ready?"
      bind:value={pr.financialDisclosureFiled}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Spousal support (alimony or maintenance) requested?"
    inputId="property-spousalSupportRequested"
  >
    <Select
      id="property-spousalSupportRequested"
      label="Spousal support (alimony or maintenance) requested?"
      bind:value={pr.spousalSupportRequested}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
