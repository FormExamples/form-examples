<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DoListItem from './DoListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DoListItem',
    component: DoListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>List item</span>
</Story>
