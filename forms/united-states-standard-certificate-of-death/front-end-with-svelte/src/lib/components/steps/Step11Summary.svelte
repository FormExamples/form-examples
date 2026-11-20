<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import { validateCertificate } from '#lib/engine/grader.js';
  import { validityClassLabel } from '#lib/engine/utils.js';

  const live = $derived(validateCertificate(assessment.data));
</script>

<Fieldset legend="Step 11 of 11 — Summary and validity">
  <p class="hint">
    The live validity class, the derived underlying cause, and the referral indication. Submit to
    generate the full report.
  </p>
  <p>
    <strong>{validityClassLabel(live.validityClass)}</strong>
    {#if live.underlyingCause}
      &mdash; underlying cause: {live.underlyingCause}
    {:else}
      &mdash; underlying cause not yet determinable (Part I empty)
    {/if}
    &mdash; {live.referralIndicated ? 'referral indicated' : 'no referral criterion met'}
  </p>
</Fieldset>
