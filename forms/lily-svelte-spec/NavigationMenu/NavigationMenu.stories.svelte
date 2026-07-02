<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NavigationMenu from './NavigationMenu.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NavigationMenu',
    component: NavigationMenu,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Navigation Menu'}}
>
  <ul><li><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li></ul>
</Story>
