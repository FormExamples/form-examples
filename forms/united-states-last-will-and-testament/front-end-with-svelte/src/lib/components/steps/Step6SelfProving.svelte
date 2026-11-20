<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import { validateWill } from '#lib/engine/will-grader.js';
  import { validityClassLabel, validityClassColor, dollars } from '#lib/engine/utils.js';

  const p = assessment.data.selfProving;
  const result = $derived(validateWill(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Self-proving affidavit">
  <p class="hint">
    A self-proving affidavit, signed by the testator and witnesses before a notary, lets the court
    accept the will without calling the witnesses. California accepts a declaration under penalty of
    perjury instead, and Ohio does not use one.
  </p>

  <Field
    label="Will a self-proving affidavit be signed?"
    inputId="selfProving-selfProvingAffidavit"
  >
    <Select
      id="selfProving-selfProvingAffidavit"
      label="Will a self-proving affidavit be signed?"
      bind:value={p.selfProvingAffidavit}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Notary — name" inputId="selfProving-notaryName">
    <TextInput id="selfProving-notaryName" label="Notary — name" bind:value={p.notaryName} />
  </Field>

  <Field
    label="Did the notary acknowledge the signatures?"
    inputId="selfProving-notaryAcknowledged"
  >
    <Select
      id="selfProving-notaryAcknowledged"
      label="Did the notary acknowledge the signatures?"
      bind:value={p.notaryAcknowledged}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Live validity status" inputId="live-validity">
    <span id="live-validity" class="flex flex-wrap items-center gap-3">
      <span
        class="inline-block rounded-full border px-3 py-1 text-sm font-semibold {validityClassColor(
          result.validityClass
        )}"
      >
        {validityClassLabel(result.validityClass)}
      </span>
      <span class="text-sm text-base-content/70">
        Residuary total: {result.residuaryPercentTotal}%
      </span>
      <span class="text-sm text-base-content/70">
        Estimated elective share: {result.electiveShareAmount === null
          ? 'not applicable'
          : dollars(result.electiveShareAmount)}
      </span>
      <span class="text-sm text-base-content/70">
        ({result.flaggedIssues.length} flagged {result.flaggedIssues.length === 1
          ? 'issue'
          : 'issues'})
      </span>
    </span>
  </Field>
</Fieldset>
