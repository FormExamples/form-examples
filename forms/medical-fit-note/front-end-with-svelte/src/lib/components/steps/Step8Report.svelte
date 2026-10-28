<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import { approvalBadgeClass, approvalLabel } from '#lib/engine/utils.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
</script>

<Fieldset legend="Step 8 of 8 — Report" id="step-8-legend">
  <p class="hint">
    Submit to compute the approval status, the rules that fired and the flags. The full report opens
    on the next page.
  </p>
  <p>
    Current status:
    <span
      class="rounded border px-2 py-0.5 text-sm font-semibold {approvalBadgeClass(
        store.result.approvalStatus
      )}">{approvalLabel(store.result.approvalStatus)}</span
    >
    · {store.result.firedRules.length} rule{store.result.firedRules.length === 1 ? '' : 's'} fired
  </p>
</Fieldset>
