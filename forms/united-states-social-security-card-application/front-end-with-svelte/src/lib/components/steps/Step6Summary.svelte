<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import { validateApplication } from '#lib/engine/ss5-grader.js';
  import { applicationClassLabel, applicationClassColor } from '#lib/engine/utils.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';

  const result = $derived(validateApplication(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Summary and class">
  <p class="hint">
    The live application class and evidence gaps. This records completeness only: the Social
    Security Administration decides every application.
  </p>

  <Field label="Live application status" inputId="summary-live-status">
    <span id="summary-live-status" class="flex flex-wrap items-center gap-3">
      <span
        class="inline-block rounded-full border px-3 py-1 text-sm font-bold {applicationClassColor(
          result.applicationClass
        )}"
      >
        {applicationClassLabel(result.applicationClass)}
      </span>
      <span class="text-sm text-base-content/70">
        Evidence gaps: {result.missingEvidenceCount}
      </span>
      {#if result.replacementLimitReached}
        <span class="text-sm text-base-content/70">Replacement limit reached</span>
      {/if}
    </span>
  </Field>
</Fieldset>
