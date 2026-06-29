<script lang="ts">
  // TextInput — Lily Svelte headless contract.
  let {
    value = $bindable(''),
    placeholder = '',
    type = 'text',
    id = undefined,
  }: {
    value: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'tel';
    id?: string;
  } = $props();

  const inputClass = $derived.by(() => {
    switch (type) {
      case 'email':
        return 'email-input';
      case 'tel':
        return 'tel-input';
      default:
        return 'text-input';
    }
  });
</script>

<input
  {type}
  {id}
  {placeholder}
  bind:value
  class={inputClass}
/>
