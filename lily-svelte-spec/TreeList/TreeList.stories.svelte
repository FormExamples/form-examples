<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TreeList from './TreeList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TreeList',
    component: TreeList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Tree List'}}
>
  <li>Item 1</li><li>Item 2</li>
</Story>
