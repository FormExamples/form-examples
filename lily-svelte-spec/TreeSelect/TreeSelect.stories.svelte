<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TreeSelect from './TreeSelect.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TreeSelect',
    component: TreeSelect,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Category', placeholder: 'Choose a category', expanded: false }}
>
  <ul role="tree" aria-label="Categories"><li role="treeitem">Books</li></ul>
</Story>
