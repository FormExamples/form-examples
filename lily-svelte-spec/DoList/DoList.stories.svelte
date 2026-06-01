<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DoList from './DoList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DoList',
    component: DoList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Do List'}}
>
  <li>Item 1</li><li>Item 2</li>
</Story>
