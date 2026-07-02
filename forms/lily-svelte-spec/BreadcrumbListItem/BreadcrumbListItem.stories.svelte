<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BreadcrumbListItem from './BreadcrumbListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/BreadcrumbListItem',
    component: BreadcrumbListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>List item</span>
</Story>
