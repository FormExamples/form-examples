<script lang="ts">
  // Progress — Lily Svelte headless contract.
  //
  // Emits: <progress class="progress" aria-label="…" value max>.
  // Mirrors forms/lily-svelte-spec/Progress/Progress.svelte.
  let {
    class: className = '',
    label,
    value = undefined,
    max = 100,
    ...restProps
  }: {
    label: string;
    value?: number;
    max?: number;
    [key: string]: unknown;
  } = $props();
</script>

<progress
  class={`progress ${className}`}
  aria-label={label}
  {value}
  {max}
  {...restProps}
></progress>
