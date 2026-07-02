<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TourListItem from './TourListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TourListItem',
    component: TourListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Tour List Item'}}
>
  <span>List item</span>
</Story>
