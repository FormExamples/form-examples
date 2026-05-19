<script lang="ts">
  import RadioGroup from './RadioGroup.svelte';
  import type { YesNoNaEmpty } from '$lib/checklist/types.js';

  let {
    label,
    value = $bindable<YesNoNaEmpty>(''),
    hint = '',
  }: { label: string; value: YesNoNaEmpty; hint?: string } = $props();
</script>

<RadioGroup
  {label}
  bind:value
  {hint}
  options={[
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'not-applicable', label: 'N/A' },
  ]}
/>
