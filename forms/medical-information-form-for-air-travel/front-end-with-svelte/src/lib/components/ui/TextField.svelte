<script lang="ts">
  // TextField — Lily Svelte headless contract.
  // Emits: <div class="field"><label class="label">...</label>
  //        <input class="text-input"></div>. Multiple input types are
  // supported via `type`; the corresponding Lily class is emitted.
  let {
    label,
    value = $bindable(),
    type = 'text',
    placeholder = '',
    hint = '',
    required = false,
    id = undefined,
  }: {
    label: string;
    value: string;
    type?: 'text' | 'email' | 'tel' | 'date' | 'time';
    placeholder?: string;
    hint?: string;
    required?: boolean;
    id?: string;
  } = $props();

  const lilyClass = $derived(
    type === 'email' ? 'email-input' :
    type === 'date' ? 'date-input' :
    type === 'time' ? 'time-input' :
    type === 'tel' ? 'tel-input' :
    'text-input',
  );
</script>

<div class="field" data-required={required || undefined}>
  <label class="label" data-required={required || undefined}>
    <span>{label}</span>
    <input
      {id}
      {type}
      {placeholder}
      class={lilyClass}
      aria-label={label}
      bind:value
      {required}
    />
  </label>
  {#if hint}<p class="hint">{hint}</p>{/if}
</div>
