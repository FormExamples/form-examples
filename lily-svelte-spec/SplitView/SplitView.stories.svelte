<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SplitView from './SplitView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SplitView',
    component: SplitView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Editor and preview' }}
>
  {#snippet primary()}
    <p>Primary panel</p>
  {/snippet}
  {#snippet secondary()}
    <p>Secondary panel</p>
  {/snippet}
</Story>
