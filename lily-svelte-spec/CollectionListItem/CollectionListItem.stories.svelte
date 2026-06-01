<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CollectionListItem from './CollectionListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CollectionListItem',
    component: CollectionListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    heading: 'My article',
    meta: 'March 2026',
    description: 'A short summary of the article.',
    href: '/articles/my-article',
  }}
/>
