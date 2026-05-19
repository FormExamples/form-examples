<script lang="ts">
  let {
    label,
    value = $bindable(),
    type = 'text',
    placeholder = '',
    hint = '',
  }: {
    label: string;
    value: string;
    type?: 'text' | 'email' | 'tel' | 'date' | 'time';
    placeholder?: string;
    hint?: string;
  } = $props();
</script>

<label class="block">
  <span class="text-sm text-slate-700">{label}</span>
  <input
    {type}
    {placeholder}
    class="w-full border rounded px-2 py-1"
    bind:value
  />
  {#if hint}<p class="text-xs text-slate-500 mt-1">{hint}</p>{/if}
</label>
