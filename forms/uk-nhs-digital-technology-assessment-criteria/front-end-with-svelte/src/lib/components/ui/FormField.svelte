<script lang="ts">
  // FormField — thin backwards-compatibility wrapper over Field.svelte.
  //
  // The pilot Lily refactor introduced `Field.svelte` which emits the
  // canonical Lily `field` / `label` / `error-message` markup. New code
  // should import `Field.svelte` directly. This wrapper preserves the
  // legacy `label` + `id` + optional `hint` shape used during the
  // pre-Lily Svelte phase.
  import type { Snippet } from 'svelte';
  import Field from './Field.svelte';

  let {
    label,
    id,
    hint = '',
    children,
  }: {
    label: string;
    id: string;
    hint?: string;
    children: Snippet;
  } = $props();
</script>

<Field {label} inputId={id} description={hint || undefined}>
  {@render children()}
</Field>
