<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CollectionList from './CollectionList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CollectionList',
    component: CollectionList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Latest articles' }}
>
  <li>First item</li>
  <li>Second item</li>
</Story>
