<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ActionBar from './ActionBar.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ActionBar',
    component: ActionBar,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: 'Bulk actions',
    selectedCount: 3,
    selectedCountLabel: '3 selected',
    clearSelectionLabel: 'Clear selection',
    onClearSelection: () => {},
  }}
/>
