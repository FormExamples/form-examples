<script lang="ts">
  // TextAreaInput — Lily Svelte headless contract.
  //
  // Emits: <textarea class="text-area-input">.
  //
  // Accepts the legacy TextArea shape (id, name, rows, placeholder) used by
  // the fit-note step components; consumers wrap with <Field> to provide a
  // visible label.
  let {
    class: className = '',
    id = undefined,
    name = undefined,
    label = undefined,
    rows = 4,
    placeholder = '',
    value = $bindable(''),
    required = false,
    disabled = false,
    ...restProps
  }: {
    id?: string;
    name?: string;
    label?: string;
    rows?: number;
    placeholder?: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    [key: string]: unknown;
  } = $props();
</script>

<textarea
  {id}
  {name}
  {rows}
  {placeholder}
  {required}
  {disabled}
  class={`text-area-input ${className}`}
  aria-label={label}
  bind:value
  {...restProps}
></textarea>
