<script lang="ts">
  let {
    current,
    total,
  }: { current: number; total: number } = $props();

  const pct = $derived(Math.min(100, Math.round((current / total) * 100)));
</script>

<div class="w-full mb-6">
  <div class="flex justify-between text-xs text-slate-600 mb-1">
    <span>Step {current} of {total}</span>
    <span>{pct}%</span>
  </div>
  <div class="w-full bg-slate-200 rounded-full h-2">
    <div class="bg-brand-600 h-2 rounded-full transition-all" style="width: {pct}%"></div>
  </div>
</div>
