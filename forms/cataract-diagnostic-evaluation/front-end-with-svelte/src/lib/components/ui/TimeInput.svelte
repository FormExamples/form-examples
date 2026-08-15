<script lang="ts">
  // TimeInput — Lily Svelte headless contract.
  //
  // Emits: <input class="time-input" type="time">.
  // Mirrors forms/lily-svelte-spec/TimeInput/TimeInput.svelte.
  let {
    class: className = '',
    label,
    value = $bindable(''),
    min = undefined,
    max = undefined,
    required = false,
    disabled = false,
    ...restProps
  }: {
    label: string;
    value?: string;
    min?: string;
    max?: string;
    required?: boolean;
    disabled?: boolean;
    [key: string]: unknown;
  } = $props();
</script>

<input
  class={`time-input ${className}`}
  type="time"
  aria-label={label}
  bind:value
  {min}
  {max}
  {required}
  {disabled}
  {...restProps}
/>
