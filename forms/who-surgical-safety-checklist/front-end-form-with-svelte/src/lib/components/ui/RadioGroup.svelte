<script lang="ts">
  /**
   * Generic radio-group bound to a string value. Pass an `options` array of
   * `{ value, label }` rows.
   */
  let {
    label,
    value = $bindable<string>(''),
    options,
    hint = '',
  }: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    hint?: string;
  } = $props();

  const name = `rg-${Math.random().toString(36).slice(2, 9)}`;
</script>

<fieldset class="block">
  <legend class="block text-sm font-medium text-slate-700 mb-1">{label}</legend>
  <div class="flex flex-wrap gap-3">
    {#each options as opt (opt.value)}
      <label class="inline-flex items-center gap-1 text-sm">
        <input
          type="radio"
          {name}
          value={opt.value}
          checked={value === opt.value}
          onchange={() => (value = opt.value)}
          class="accent-brand-600"
        />
        <span>{opt.label}</span>
      </label>
    {/each}
  </div>
  {#if hint}<p class="text-xs text-slate-500 mt-1">{hint}</p>{/if}
</fieldset>
