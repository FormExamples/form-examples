<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ContentsListItem from './ContentsListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ContentsListItem',
    component: ContentsListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>List item</span>
</Story>
