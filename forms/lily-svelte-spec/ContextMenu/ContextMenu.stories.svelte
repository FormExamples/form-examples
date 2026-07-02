<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ContextMenu from './ContextMenu.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ContextMenu',
    component: ContextMenu,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Context Menu'}}
>
  <ul><li>Option 1</li><li>Option 2</li></ul>
</Story>
