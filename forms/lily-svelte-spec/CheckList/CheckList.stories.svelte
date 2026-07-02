<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CheckList from './CheckList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CheckList',
    component: CheckList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Check List'}}
>
  <li>Item 1</li><li>Item 2</li>
</Story>
