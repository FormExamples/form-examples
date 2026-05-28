<script lang="ts">
  // TelInput — Lily Svelte headless contract.
  //
  // Emits: <input class="tel-input" type="tel">.
  let {
    class: className = '',
    label,
    value = $bindable(''),
    required = false,
    disabled = false,
    ...restProps
  }: {
    label: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    [key: string]: unknown;
  } = $props();
</script>

<input
  class={`tel-input ${className}`}
  type="tel"
  aria-label={label}
  bind:value
  autocomplete="tel"
  {required}
  {disabled}
  {...restProps}
/>
