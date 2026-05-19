<script lang="ts">
  /**
   * Single-line text input, two-way bound via `$bindable`.
   */
  let {
    label,
    value = $bindable(''),
    placeholder = '',
    hint = '',
    type = 'text',
    required = false,
    multiline = false,
    rows = 3,
  }: {
    label: string;
    value: string;
    placeholder?: string;
    hint?: string;
    type?: 'text' | 'date' | 'time' | 'datetime-local' | 'email' | 'tel';
    required?: boolean;
    multiline?: boolean;
    rows?: number;
  } = $props();

  const id = `tf-${Math.random().toString(36).slice(2, 9)}`;
</script>

<div class="block">
  <label for={id} class="block text-sm font-medium text-slate-700 mb-1">
    {label}{#if required}<span class="text-red-600"> *</span>{/if}
  </label>
  {#if multiline}
    <textarea
      {id}
      bind:value
      {rows}
      {placeholder}
      class="w-full border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
    ></textarea>
  {:else}
    <input
      {id}
      {type}
      bind:value
      {placeholder}
      class="w-full border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
    />
  {/if}
  {#if hint}<p class="text-xs text-slate-500 mt-1">{hint}</p>{/if}
</div>
