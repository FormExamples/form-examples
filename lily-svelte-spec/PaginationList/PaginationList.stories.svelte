<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PaginationList from './PaginationList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PaginationList',
    component: PaginationList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Pagination List'}}
>
  <li>Item 1</li><li>Item 2</li>
</Story>
