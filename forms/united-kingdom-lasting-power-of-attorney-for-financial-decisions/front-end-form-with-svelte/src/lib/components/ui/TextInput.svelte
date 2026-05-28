<script lang="ts">
  // TextInput — Lily Svelte headless contract.
  let {
    value = $bindable(''),
    placeholder = '',
    type = 'text',
  }: {
    value: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'tel';
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
  {placeholder}
  bind:value
  class={inputClass}
/>
