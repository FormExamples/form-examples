<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Cascader from './Cascader.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Cascader',
    component: Cascader,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Region', placeholder: 'Choose a region', expanded: false }}
>
  <ul role="tree"><li role="treeitem">USA</li></ul>
</Story>
