<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TimelineListItem from './TimelineListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TimelineListItem',
    component: TimelineListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'heading':'Timeline List Item Heading'}}
>
  <span>List item</span>
</Story>
