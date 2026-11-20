<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import { validateApplication } from '#lib/engine/birth-grader.js';
  import { applicationClassLabel, applicationClassColor } from '#lib/engine/utils.js';

  const d = assessment.data.declaration;
  const result = $derived(validateApplication(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Declaration">
  <p class="hint">
    You declare under penalty of perjury that you are entitled to the record and that the
    information is true. This records the declaration status only; the issuing agency decides.
  </p>

  <Field label="I have signed the declaration" inputId="declaration-declarationSigned">
    <Select
      id="declaration-declarationSigned"
      label="I have signed the declaration"
      bind:value={d.declarationSigned}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Note to the vital records office" inputId="declaration-applicationNote">
    <TextAreaInput
      id="declaration-applicationNote"
      label="Note to the vital records office"
      rows={3}
      placeholder="Optional."
      bind:value={d.applicationNote}
    />
  </Field>

  <Field label="Live application status">
    <span class="inline-flex flex-wrap items-center gap-3">
      <span
        class="inline-block rounded-full border px-3 py-1 text-sm font-bold {applicationClassColor(
          result.applicationClass
        )}"
      >
        {applicationClassLabel(result.applicationClass)}
      </span>
      <span class="text-sm text-base-content/70">
        Expected fee: {result.expectedFeeUsd === null
          ? 'unknown'
          : `$${result.expectedFeeUsd.toFixed(2)}`}
      </span>
      <span class="text-sm text-base-content/70">
        ({result.flaggedIssues.length} flagged {result.flaggedIssues.length === 1
          ? 'issue'
          : 'issues'})
      </span>
    </span>
  </Field>
</Fieldset>
