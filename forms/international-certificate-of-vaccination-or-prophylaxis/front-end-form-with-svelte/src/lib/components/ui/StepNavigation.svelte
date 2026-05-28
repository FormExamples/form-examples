<script lang="ts">
  // StepNavigation — Lily Svelte headless contract (button + data-variant).
  interface Props {
    current: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
  }
  let { current, total, onPrev, onNext }: Props = $props();
</script>

<div class="button-group">
  <button
    type="button"
    class="button"
    data-variant="secondary"
    disabled={current === 1}
    onclick={onPrev}
  >
    ← Back
  </button>
  <button
    type="button"
    class="button"
    data-variant="primary"
    disabled={current === total}
    onclick={onNext}
  >
    Next →
  </button>
</div>
