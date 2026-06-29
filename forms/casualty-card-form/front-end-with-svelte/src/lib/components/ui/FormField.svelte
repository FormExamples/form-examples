<script lang="ts">
  // FormField — thin backwards-compatibility wrapper over Field.svelte.
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
