<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TransferList from './TransferList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TransferList',
    component: TransferList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: 'Roles',
    sourceLabel: 'Available',
    targetLabel: 'Selected',
  }}
>
  {#snippet source()}
    <ul role="listbox" aria-label="Available">
      <li role="option" aria-selected="false">Admin</li>
      <li role="option" aria-selected="false">Editor</li>
    </ul>
  {/snippet}
  {#snippet actions()}
    <button type="button" aria-label="Move right">→</button>
    <button type="button" aria-label="Move left">←</button>
  {/snippet}
  {#snippet target()}
    <ul role="listbox" aria-label="Selected">
      <li role="option" aria-selected="false">Viewer</li>
    </ul>
  {/snippet}
</Story>
