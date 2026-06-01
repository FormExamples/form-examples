<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PaginationNav from './PaginationNav.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PaginationNav',
    component: PaginationNav,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Pagination Nav'}}
>
  <ul><li><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li></ul>
</Story>
