<script lang="ts">
  /**
   * Numeric input bound to `number | null`. An empty input is reflected as
   * `null` (matching the project convention for unanswered numeric fields).
   */
  let {
    label,
    value = $bindable<number | null>(null),
    min,
    max,
    step,
    suffix = '',
    hint = '',
  }: {
    label: string;
    value: number | null;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string;
    hint?: string;
  } = $props();

  const id = `nf-${Math.random().toString(36).slice(2, 9)}`;

  function onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.value === '') {
      value = null;
    } else {
      const n = Number(target.value);
      value = Number.isFinite(n) ? n : null;
    }
  }
</script>

<div class="block">
  <label for={id} class="block text-sm font-medium text-slate-700 mb-1">{label}</label>
  <div class="flex items-center gap-2">
    <input
      {id}
      type="number"
      value={value ?? ''}
      {min}
      {max}
      {step}
      oninput={onInput}
      class="w-full border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
    />
    {#if suffix}<span class="text-sm text-slate-600">{suffix}</span>{/if}
  </div>
  {#if hint}<p class="text-xs text-slate-500 mt-1">{hint}</p>{/if}
</div>
