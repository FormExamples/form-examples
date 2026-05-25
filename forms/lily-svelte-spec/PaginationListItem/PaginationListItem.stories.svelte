<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PaginationListItem from './PaginationListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PaginationListItem',
    component: PaginationListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>List item</span>
</Story>
