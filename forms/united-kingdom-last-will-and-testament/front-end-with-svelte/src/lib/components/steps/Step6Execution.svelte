<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput, TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import { validateWill } from '#lib/engine/will-grader.js';
  import { validityClassLabel, validityClassColor } from '#lib/engine/utils.js';

  const s = assessment.data.execution;
  const result = $derived(validateWill(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Signing and witnessing">
  <p class="hint">
    Wills Act 1837 s.9: in writing, signed by the testator in the presence of two independent adult
    witnesses present together, who then each sign. A witness, or their spouse or civil partner,
    must not be a beneficiary.
  </p>

  <Field label="Status" inputId="execution-executionStatus">
    <Select id="execution-executionStatus" label="Status" bind:value={s.executionStatus}>
      <option value="">— Select —</option>
      <option value="draft">Draft — not yet signed</option>
      <option value="signed">Signed and witnessed</option>
    </Select>
  </Field>

  <Field label="Date of will" inputId="execution-dateOfWill">
    <DateInput id="execution-dateOfWill" label="Date of will" bind:value={s.dateOfWill} />
  </Field>

  <Field label="Is the will in writing?" inputId="execution-willInWriting">
    <Select
      id="execution-willInWriting"
      label="Is the will in writing?"
      bind:value={s.willInWriting}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Did the testator sign (or acknowledge their signature) intending it to give effect to the will?"
    inputId="execution-testatorSigned"
  >
    <Select
      id="execution-testatorSigned"
      label="Did the testator sign (or acknowledge their signature) intending it to give effect to the will?"
      bind:value={s.testatorSigned}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Were both witnesses present together when the testator signed or acknowledged?"
    inputId="execution-witnessesPresentTogether"
  >
    <Select
      id="execution-witnessesPresentTogether"
      label="Were both witnesses present together when the testator signed or acknowledged?"
      bind:value={s.witnessesPresentTogether}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Did each witness then sign in the testator’s presence?"
    inputId="execution-witnessesSigned"
  >
    <Select
      id="execution-witnessesSigned"
      label="Did each witness then sign in the testator’s presence?"
      bind:value={s.witnessesSigned}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="First witness — name" inputId="execution-witnessFirstName">
    <TextInput
      id="execution-witnessFirstName"
      label="First witness — name"
      bind:value={s.witnessFirstName}
    />
  </Field>

  <Field label="First witness — 18 or over?" inputId="execution-witnessFirstOver18">
    <Select
      id="execution-witnessFirstOver18"
      label="First witness — 18 or over?"
      bind:value={s.witnessFirstOver18}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="First witness — is the witness, or their spouse or civil partner, a beneficiary?"
    inputId="execution-witnessFirstIsBeneficiaryOrSpouse"
  >
    <Select
      id="execution-witnessFirstIsBeneficiaryOrSpouse"
      label="First witness — is the witness, or their spouse or civil partner, a beneficiary?"
      bind:value={s.witnessFirstIsBeneficiaryOrSpouse}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Second witness — name" inputId="execution-witnessSecondName">
    <TextInput
      id="execution-witnessSecondName"
      label="Second witness — name"
      bind:value={s.witnessSecondName}
    />
  </Field>

  <Field label="Second witness — 18 or over?" inputId="execution-witnessSecondOver18">
    <Select
      id="execution-witnessSecondOver18"
      label="Second witness — 18 or over?"
      bind:value={s.witnessSecondOver18}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Second witness — is the witness, or their spouse or civil partner, a beneficiary?"
    inputId="execution-witnessSecondIsBeneficiaryOrSpouse"
  >
    <Select
      id="execution-witnessSecondIsBeneficiaryOrSpouse"
      label="Second witness — is the witness, or their spouse or civil partner, a beneficiary?"
      bind:value={s.witnessSecondIsBeneficiaryOrSpouse}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Drafter note" inputId="execution-drafterNote">
    <TextAreaInput
      id="execution-drafterNote"
      label="Drafter note"
      rows={3}
      bind:value={s.drafterNote}
    />
  </Field>

  <Field label="Live validity status">
    <span class="inline-flex flex-wrap items-center gap-3">
      <span
        class="inline-block rounded-full border px-3 py-1 text-sm font-bold {validityClassColor(
          result.validityClass
        )}"
      >
        {validityClassLabel(result.validityClass)}
      </span>
      <span class="text-sm text-base-content/70">Shares total: {result.sharesTotalPercent}%</span>
      <span class="text-sm text-base-content/70">Witnesses named: {result.witnessCount}</span>
      <span class="text-sm text-base-content/70">
        ({result.flaggedIssues.length} flagged {result.flaggedIssues.length === 1
          ? 'issue'
          : 'issues'})
      </span>
    </span>
  </Field>
</Fieldset>
