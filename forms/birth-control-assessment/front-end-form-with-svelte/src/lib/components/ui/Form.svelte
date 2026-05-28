<script lang="ts">
  // Form — Lily Svelte headless contract.
  //
  // Emits: <form class="form" aria-label="...">. Calls event.preventDefault()
  // before invoking the consumer's onsubmit handler.
  // Mirrors forms/lily-svelte-spec/Form/Form.svelte.
  import type { Snippet } from 'svelte';

  let {
    class: className = '',
    label,
    onsubmit = undefined,
    onreset = undefined,
    children,
    ...restProps
  }: {
    label: string;
    onsubmit?: (event: SubmitEvent) => void;
    onreset?: (event: Event) => void;
    children: Snippet;
    [key: string]: unknown;
  } = $props();

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    onsubmit?.(event);
  }
</script>

<form
  class={`form ${className}`}
  aria-label={label}
  onsubmit={handleSubmit}
  {onreset}
  {...restProps}
>
  {@render children?.()}
</form>
