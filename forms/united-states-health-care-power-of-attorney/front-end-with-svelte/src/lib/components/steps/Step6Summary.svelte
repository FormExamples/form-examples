<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import { evaluateDirective } from '#lib/engine/grader.js';
  import { readinessClassColor, readinessClassLabel } from '#lib/engine/utils.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';

  const result = $derived(evaluateDirective(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Summary and readiness">
  <p class="hint">
    The live readiness class and the state rule applied. This is documentation support, not legal
    advice; a court, the treating facility, and the state decide whether a directive is valid.
  </p>

  <Field label="Live readiness status">
    <span class="inline-flex flex-wrap items-center gap-3">
      <span
        class="inline-block rounded-full border px-3 py-1 text-sm font-bold {readinessClassColor(
          result.readinessClass
        )}"
      >
        {readinessClassLabel(result.readinessClass)}
      </span>
      <span class="text-sm text-base-content/70">
        State rule: {assessment.data.principal.state ? result.ruleSetName : 'choose a state'}
      </span>
      <span class="text-sm text-base-content/70">
        ({result.flaggedIssues.length} flagged {result.flaggedIssues.length === 1
          ? 'issue'
          : 'issues'})
      </span>
    </span>
  </Field>
</Fieldset>
