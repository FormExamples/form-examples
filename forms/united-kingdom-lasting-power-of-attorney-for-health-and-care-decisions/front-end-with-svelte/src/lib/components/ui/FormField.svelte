<script lang="ts">
  // FormField — Lily Svelte headless contract.
  // Emits the Lily class vocabulary: field / label / text-input / date-input /
  // email-input / tel-input / hint.
  interface Props {
    label: string;
    value: string;
    type?: 'text' | 'email' | 'tel' | 'date' | 'datetime-local';
    placeholder?: string;
    hint?: string;
    required?: boolean;
    onchange?: () => void;
  }
  let {
    label,
    value = $bindable(),
    type = 'text',
    placeholder = '',
    hint = '',
    required = false,
    onchange,
  }: Props = $props();

  const id = `f-${Math.random().toString(36).slice(2, 10)}`;

  const inputClass = $derived.by(() => {
    switch (type) {
      case 'date':
      case 'datetime-local':
        return 'date-input';
      case 'email':
        return 'email-input';
      case 'tel':
        return 'tel-input';
      default:
        return 'text-input';
    }
  });
</script>

<div class="field">
  <label for={id} class="label" data-required={required || undefined}>
    {label}
  </label>
  <input
    {id}
    {type}
    {placeholder}
    bind:value
    oninput={() => onchange?.()}
    class={inputClass}
  />
  {#if hint}<span class="hint">{hint}</span>{/if}
</div>
