<script lang="ts">
  // StepNavigation — Lily Svelte headless contract (button + data-variant).
  import { assessment, TOTAL_STEPS } from '$lib/stores/assessment.svelte';
</script>

<div class="button-group">
  <button
    type="button"
    class="button"
    data-variant="secondary"
    disabled={assessment.currentStep === 1}
    onclick={() => assessment.prev()}
  >
    ← Back
  </button>
  <button
    type="button"
    class="button"
    data-variant="primary"
    disabled={assessment.currentStep === TOTAL_STEPS}
    onclick={() => assessment.next()}
  >
    Next →
  </button>
</div>
