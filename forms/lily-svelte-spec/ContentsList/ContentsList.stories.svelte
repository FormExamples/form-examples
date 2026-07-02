<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ContentsList from './ContentsList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ContentsList',
    component: ContentsList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <li>Item 1</li><li>Item 2</li>
</Story>
