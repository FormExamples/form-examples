<script lang="ts">
  // Select — Lily Svelte headless contract.
  //
  // Supports both:
  // - canonical: pass <option> children inside <Select>.
  // - legacy SelectInput shape: pass `options=[{value,label}]` and an
  //   optional `name=` to render the option list automatically and wrap
  //   the control in a <div class="field"><label class="label">… so
  //   pre-existing step files migrate cleanly.
  import type { Snippet } from 'svelte';

  interface Option {
    value: string;
    label: string;
  }

  let {
    class: className = '',
    label,
    name = undefined,
    options = undefined,
    placeholder = '-- Select --',
    value = $bindable<string>(''),
    required = false,
    disabled = false,
    children = undefined,
    ...restProps
  }: {
    label: string;
    name?: string;
    options?: Option[];
    placeholder?: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    children?: Snippet;
    [key: string]: unknown;
  } = $props();
</script>

{#if options}
  <div class="field">
    <label class="label" for={name} data-required={required || undefined}>{label}</label>
    <select
      id={name}
      {name}
      class={`select ${className}`}
      bind:value
      {required}
      {disabled}
      {...restProps}
    >
      <option value="">{placeholder}</option>
      {#each options as opt (opt.value)}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
  </div>
{:else}
  <select
    class={`select ${className}`}
    aria-label={label}
    bind:value
    {required}
    {disabled}
    {...restProps}
  >
    {@render children?.()}
  </select>
{/if}
