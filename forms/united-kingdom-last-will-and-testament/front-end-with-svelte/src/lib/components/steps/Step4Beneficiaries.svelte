<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import { sharesTotalPercent } from '#lib/engine/will-rules.js';

  const s = assessment.data.beneficiaries;
  const total = $derived(sharesTotalPercent(assessment.data));
</script>

<Fieldset legend="Step 4 of 6 — Beneficiaries and residuary estate">
  <p class="hint">
    Who inherits. Give each beneficiary a percentage share of the residuary estate; the shares must
    total 100%.
  </p>

  <Field label="First beneficiary — name" inputId="beneficiaries-beneficiaryFirstName">
    <TextInput
      id="beneficiaries-beneficiaryFirstName"
      label="First beneficiary — name"
      bind:value={s.beneficiaryFirstName}
    />
  </Field>

  <Field
    label="First beneficiary — relationship"
    inputId="beneficiaries-beneficiaryFirstRelationship"
  >
    <Select
      id="beneficiaries-beneficiaryFirstRelationship"
      label="First beneficiary — relationship"
      bind:value={s.beneficiaryFirstRelationship}
    >
      <option value="">— Select —</option>
      <option value="spouse-or-civil-partner">Spouse or civil partner</option>
      <option value="unmarried-partner">Unmarried partner</option>
      <option value="child">Child</option>
      <option value="grandchild">Grandchild</option>
      <option value="other-relative">Other relative</option>
      <option value="friend">Friend</option>
      <option value="charity">Charity</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field
    label="First beneficiary — share of the residuary estate (%)"
    inputId="beneficiaries-beneficiaryFirstSharePercent"
  >
    <NumberInput
      id="beneficiaries-beneficiaryFirstSharePercent"
      label="First beneficiary — share of the residuary estate (%)"
      min={0}
      max={100}
      step={0.01}
      bind:value={s.beneficiaryFirstSharePercent}
    />
  </Field>

  <Field label="First beneficiary — under 18?" inputId="beneficiaries-beneficiaryFirstIsMinor">
    <Select
      id="beneficiaries-beneficiaryFirstIsMinor"
      label="First beneficiary — under 18?"
      bind:value={s.beneficiaryFirstIsMinor}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="First beneficiary — trustee appointed to hold the share until they are 18?"
    inputId="beneficiaries-beneficiaryFirstHasTrustee"
  >
    <Select
      id="beneficiaries-beneficiaryFirstHasTrustee"
      label="First beneficiary — trustee appointed to hold the share until they are 18?"
      bind:value={s.beneficiaryFirstHasTrustee}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Second beneficiary — name" inputId="beneficiaries-beneficiarySecondName">
    <TextInput
      id="beneficiaries-beneficiarySecondName"
      label="Second beneficiary — name"
      bind:value={s.beneficiarySecondName}
    />
  </Field>

  <Field
    label="Second beneficiary — relationship"
    inputId="beneficiaries-beneficiarySecondRelationship"
  >
    <Select
      id="beneficiaries-beneficiarySecondRelationship"
      label="Second beneficiary — relationship"
      bind:value={s.beneficiarySecondRelationship}
    >
      <option value="">— Select —</option>
      <option value="spouse-or-civil-partner">Spouse or civil partner</option>
      <option value="unmarried-partner">Unmarried partner</option>
      <option value="child">Child</option>
      <option value="grandchild">Grandchild</option>
      <option value="other-relative">Other relative</option>
      <option value="friend">Friend</option>
      <option value="charity">Charity</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field
    label="Second beneficiary — share of the residuary estate (%)"
    inputId="beneficiaries-beneficiarySecondSharePercent"
  >
    <NumberInput
      id="beneficiaries-beneficiarySecondSharePercent"
      label="Second beneficiary — share of the residuary estate (%)"
      min={0}
      max={100}
      step={0.01}
      bind:value={s.beneficiarySecondSharePercent}
    />
  </Field>

  <Field label="Second beneficiary — under 18?" inputId="beneficiaries-beneficiarySecondIsMinor">
    <Select
      id="beneficiaries-beneficiarySecondIsMinor"
      label="Second beneficiary — under 18?"
      bind:value={s.beneficiarySecondIsMinor}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Second beneficiary — trustee appointed to hold the share until they are 18?"
    inputId="beneficiaries-beneficiarySecondHasTrustee"
  >
    <Select
      id="beneficiaries-beneficiarySecondHasTrustee"
      label="Second beneficiary — trustee appointed to hold the share until they are 18?"
      bind:value={s.beneficiarySecondHasTrustee}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Third beneficiary — name" inputId="beneficiaries-beneficiaryThirdName">
    <TextInput
      id="beneficiaries-beneficiaryThirdName"
      label="Third beneficiary — name"
      bind:value={s.beneficiaryThirdName}
    />
  </Field>

  <Field
    label="Third beneficiary — relationship"
    inputId="beneficiaries-beneficiaryThirdRelationship"
  >
    <Select
      id="beneficiaries-beneficiaryThirdRelationship"
      label="Third beneficiary — relationship"
      bind:value={s.beneficiaryThirdRelationship}
    >
      <option value="">— Select —</option>
      <option value="spouse-or-civil-partner">Spouse or civil partner</option>
      <option value="unmarried-partner">Unmarried partner</option>
      <option value="child">Child</option>
      <option value="grandchild">Grandchild</option>
      <option value="other-relative">Other relative</option>
      <option value="friend">Friend</option>
      <option value="charity">Charity</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field
    label="Third beneficiary — share of the residuary estate (%)"
    inputId="beneficiaries-beneficiaryThirdSharePercent"
  >
    <NumberInput
      id="beneficiaries-beneficiaryThirdSharePercent"
      label="Third beneficiary — share of the residuary estate (%)"
      min={0}
      max={100}
      step={0.01}
      bind:value={s.beneficiaryThirdSharePercent}
    />
  </Field>

  <Field label="Third beneficiary — under 18?" inputId="beneficiaries-beneficiaryThirdIsMinor">
    <Select
      id="beneficiaries-beneficiaryThirdIsMinor"
      label="Third beneficiary — under 18?"
      bind:value={s.beneficiaryThirdIsMinor}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Third beneficiary — trustee appointed to hold the share until they are 18?"
    inputId="beneficiaries-beneficiaryThirdHasTrustee"
  >
    <Select
      id="beneficiaries-beneficiaryThirdHasTrustee"
      label="Third beneficiary — trustee appointed to hold the share until they are 18?"
      bind:value={s.beneficiaryThirdHasTrustee}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Fourth beneficiary — name" inputId="beneficiaries-beneficiaryFourthName">
    <TextInput
      id="beneficiaries-beneficiaryFourthName"
      label="Fourth beneficiary — name"
      bind:value={s.beneficiaryFourthName}
    />
  </Field>

  <Field
    label="Fourth beneficiary — relationship"
    inputId="beneficiaries-beneficiaryFourthRelationship"
  >
    <Select
      id="beneficiaries-beneficiaryFourthRelationship"
      label="Fourth beneficiary — relationship"
      bind:value={s.beneficiaryFourthRelationship}
    >
      <option value="">— Select —</option>
      <option value="spouse-or-civil-partner">Spouse or civil partner</option>
      <option value="unmarried-partner">Unmarried partner</option>
      <option value="child">Child</option>
      <option value="grandchild">Grandchild</option>
      <option value="other-relative">Other relative</option>
      <option value="friend">Friend</option>
      <option value="charity">Charity</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field
    label="Fourth beneficiary — share of the residuary estate (%)"
    inputId="beneficiaries-beneficiaryFourthSharePercent"
  >
    <NumberInput
      id="beneficiaries-beneficiaryFourthSharePercent"
      label="Fourth beneficiary — share of the residuary estate (%)"
      min={0}
      max={100}
      step={0.01}
      bind:value={s.beneficiaryFourthSharePercent}
    />
  </Field>

  <Field label="Fourth beneficiary — under 18?" inputId="beneficiaries-beneficiaryFourthIsMinor">
    <Select
      id="beneficiaries-beneficiaryFourthIsMinor"
      label="Fourth beneficiary — under 18?"
      bind:value={s.beneficiaryFourthIsMinor}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Fourth beneficiary — trustee appointed to hold the share until they are 18?"
    inputId="beneficiaries-beneficiaryFourthHasTrustee"
  >
    <Select
      id="beneficiaries-beneficiaryFourthHasTrustee"
      label="Fourth beneficiary — trustee appointed to hold the share until they are 18?"
      bind:value={s.beneficiaryFourthHasTrustee}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Does the will give away the residuary estate (everything not otherwise left)?"
    inputId="beneficiaries-residuaryClause"
  >
    <Select
      id="beneficiaries-residuaryClause"
      label="Does the will give away the residuary estate (everything not otherwise left)?"
      bind:value={s.residuaryClause}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Have you considered who might claim reasonable provision under the Inheritance (Provision for Family and Dependants) Act 1975?"
    inputId="beneficiaries-dependantsConsidered"
  >
    <Select
      id="beneficiaries-dependantsConsidered"
      label="Have you considered who might claim reasonable provision under the Inheritance (Provision for Family and Dependants) Act 1975?"
      bind:value={s.dependantsConsidered}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Total of shares">
    <span class="text-sm text-base-content/80">
      <strong>{total}%</strong>
      {Math.abs(total - 100) <= 0.005 ? '— shares total 100%' : '— shares must total 100%'}
    </span>
  </Field>
</Fieldset>
