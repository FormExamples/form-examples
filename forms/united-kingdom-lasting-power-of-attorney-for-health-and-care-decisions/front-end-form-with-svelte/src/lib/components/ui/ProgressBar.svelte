<script lang="ts">
  // ProgressBar — Lily Svelte headless contract (emits class="progress").
  interface Props {
    current: number;
    total: number;
  }
  let { current, total }: Props = $props();
  const percent = $derived(Math.round((current / total) * 100));
</script>

<div class="field" aria-live="polite">
  <div class="hint">
    <span>Step {current} of {total}</span>
    <span> · {percent}%</span>
  </div>
  <progress
    class="progress"
    value={percent}
    max="100"
    aria-label="Wizard progress"
  ></progress>
</div>
