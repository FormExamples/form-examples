<script lang="ts">
  import RadioGroup from './RadioGroup.svelte';
  import type { YesNoEmpty } from '$lib/checklist/types.js';

  let {
    label,
    value = $bindable<YesNoEmpty>(''),
    hint = '',
  }: { label: string; value: YesNoEmpty; hint?: string } = $props();
</script>

<RadioGroup
  {label}
  bind:value
  {hint}
  options={[
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ]}
/>
