<script lang="ts">
  import type { YesNo } from '$lib/engine/types.js';
  interface Props {
    label: string;
    value: YesNo;
    hint?: string;
    onchange?: () => void;
  }
  let { label, value = $bindable(), hint = '', onchange }: Props = $props();
  const name = `yn-${Math.random().toString(36).slice(2, 10)}`;
</script>

<fieldset class="block">
  <legend class="mb-1 text-sm font-medium text-slate-700">{label}</legend>
  <div class="flex gap-4">
    <label class="flex items-center gap-2 text-sm text-slate-700">
      <input type="radio" {name} value="yes" bind:group={value} onchange={() => onchange?.()} />
      Yes
    </label>
    <label class="flex items-center gap-2 text-sm text-slate-700">
      <input type="radio" {name} value="no" bind:group={value} onchange={() => onchange?.()} />
      No
    </label>
  </div>
  {#if hint}<p class="mt-1 text-xs text-slate-500">{hint}</p>{/if}
</fieldset>
