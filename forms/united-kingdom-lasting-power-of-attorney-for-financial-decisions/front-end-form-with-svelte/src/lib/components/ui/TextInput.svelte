<script lang="ts">
  let {
    value = $bindable(''),
    placeholder = '',
    type = 'text',
  }: {
    value: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'tel';
  } = $props();
</script>

<input
  {type}
  {placeholder}
  bind:value
  class="w-full border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-brand-500"
/>
