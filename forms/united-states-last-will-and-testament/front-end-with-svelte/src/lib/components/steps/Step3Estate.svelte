<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const p = assessment.data.estate;
</script>

<Fieldset legend="Step 3 of 6 — Estate and bequests">
  <p class="hint">
    Specific gifts, and the residuary clause that gives away everything else. The residuary shares
    must add up to exactly 100%.
  </p>

  <Field label="Estimated estate value (US dollars)" inputId="estate-estimatedEstateValue">
    <NumberInput
      id="estate-estimatedEstateValue"
      label="Estimated estate value (US dollars)"
      min={0}
      step={1000}
      bind:value={p.estimatedEstateValue}
    />
  </Field>

  <Field
    label="Specific bequests — total value (US dollars)"
    inputId="estate-specificBequestsTotal"
  >
    <NumberInput
      id="estate-specificBequestsTotal"
      label="Specific bequests — total value (US dollars)"
      min={0}
      step={1000}
      bind:value={p.specificBequestsTotal}
    />
  </Field>

  <Field label="Specific bequests — summary" inputId="estate-specificBequestsSummary">
    <TextAreaInput
      id="estate-specificBequestsSummary"
      label="Specific bequests — summary"
      rows={3}
      placeholder="e.g. $25,000 to the church; the family home to my daughter"
      bind:value={p.specificBequestsSummary}
    />
  </Field>

  <Field label="Is there a residuary clause?" inputId="estate-residuaryClausePresent">
    <Select
      id="estate-residuaryClausePresent"
      label="Is there a residuary clause?"
      bind:value={p.residuaryClausePresent}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Residuary beneficiary 1 — name" inputId="estate-residuary1Name">
    <TextInput
      id="estate-residuary1Name"
      label="Residuary beneficiary 1 — name"
      bind:value={p.residuary1Name}
    />
  </Field>

  <Field label="Residuary beneficiary 1 — share (%)" inputId="estate-residuary1Percent">
    <NumberInput
      id="estate-residuary1Percent"
      label="Residuary beneficiary 1 — share (%)"
      min={0}
      max={100}
      step={0.01}
      bind:value={p.residuary1Percent}
    />
  </Field>

  <Field label="Residuary beneficiary 2 — name" inputId="estate-residuary2Name">
    <TextInput
      id="estate-residuary2Name"
      label="Residuary beneficiary 2 — name"
      bind:value={p.residuary2Name}
    />
  </Field>

  <Field label="Residuary beneficiary 2 — share (%)" inputId="estate-residuary2Percent">
    <NumberInput
      id="estate-residuary2Percent"
      label="Residuary beneficiary 2 — share (%)"
      min={0}
      max={100}
      step={0.01}
      bind:value={p.residuary2Percent}
    />
  </Field>

  <Field label="Residuary beneficiary 3 — name" inputId="estate-residuary3Name">
    <TextInput
      id="estate-residuary3Name"
      label="Residuary beneficiary 3 — name"
      bind:value={p.residuary3Name}
    />
  </Field>

  <Field label="Residuary beneficiary 3 — share (%)" inputId="estate-residuary3Percent">
    <NumberInput
      id="estate-residuary3Percent"
      label="Residuary beneficiary 3 — share (%)"
      min={0}
      max={100}
      step={0.01}
      bind:value={p.residuary3Percent}
    />
  </Field>

  <Field
    label="Is a contingent (backup) beneficiary named?"
    inputId="estate-contingentBeneficiaryNamed"
  >
    <Select
      id="estate-contingentBeneficiaryNamed"
      label="Is a contingent (backup) beneficiary named?"
      bind:value={p.contingentBeneficiaryNamed}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
