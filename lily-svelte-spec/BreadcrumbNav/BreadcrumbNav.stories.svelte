<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BreadcrumbNav from './BreadcrumbNav.svelte';

  const { Story } = defineMeta({
    title: 'Headless/BreadcrumbNav',
    component: BreadcrumbNav,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Breadcrumb Nav'}}
>
  <ul><li><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li></ul>
</Story>
