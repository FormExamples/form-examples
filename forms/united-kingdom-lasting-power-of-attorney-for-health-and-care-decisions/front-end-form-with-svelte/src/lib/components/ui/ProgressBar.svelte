<script lang="ts">
  interface Props {
    current: number;
    total: number;
  }
  let { current, total }: Props = $props();
  const percent = $derived(Math.round((current / total) * 100));
</script>

<div class="w-full" aria-live="polite">
  <div class="mb-1 flex items-center justify-between text-xs text-slate-600">
    <span>Step {current} of {total}</span>
    <span>{percent}%</span>
  </div>
  <div class="h-2 w-full rounded-full bg-slate-200">
    <div class="h-2 rounded-full bg-brand-500 transition-all" style="width: {percent}%"></div>
  </div>
</div>
