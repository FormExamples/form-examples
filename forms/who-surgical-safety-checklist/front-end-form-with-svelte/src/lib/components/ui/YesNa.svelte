<script lang="ts">
  import RadioGroup from './RadioGroup.svelte';
  import type { YesNaEmpty } from '$lib/checklist/types.js';

  let {
    label,
    value = $bindable<YesNaEmpty>(''),
    hint = '',
  }: { label: string; value: YesNaEmpty; hint?: string } = $props();
</script>

<RadioGroup
  {label}
  bind:value
  {hint}
  options={[
    { value: 'yes', label: 'Yes' },
    { value: 'not-applicable', label: 'N/A' },
  ]}
/>
