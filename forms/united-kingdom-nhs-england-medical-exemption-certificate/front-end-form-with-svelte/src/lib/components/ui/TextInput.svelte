<script lang="ts">
  // TextInput — Lily Svelte headless contract.
  let {
    label,
    name,
    value = $bindable(''),
    placeholder = '',
    required = false,
    type = 'text'
  }: {
    label: string;
    name: string;
    value: string;
    placeholder?: string;
    required?: boolean;
    type?: 'text' | 'date' | 'datetime-local' | 'time' | 'email' | 'tel';
  } = $props();

  const inputClass = $derived.by(() => {
    switch (type) {
      case 'date':
      case 'datetime-local':
        return 'date-input';
      case 'time':
        return 'time-input';
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
  <label class="label" for={name} data-required={required || undefined}>{label}</label>
  <input
    id={name}
    {name}
    {type}
    {placeholder}
    {required}
    class={inputClass}
    bind:value
  />
</div>
