<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DontListItem from './DontListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DontListItem',
    component: DontListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>List item</span>
</Story>
