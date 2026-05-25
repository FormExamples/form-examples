<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BreadcrumbList from './BreadcrumbList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/BreadcrumbList',
    component: BreadcrumbList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <li>Item 1</li><li>Item 2</li>
</Story>
