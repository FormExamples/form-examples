<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import HamburgerMenu from './HamburgerMenu.svelte';

  const { Story } = defineMeta({
    title: 'Headless/HamburgerMenu',
    component: HamburgerMenu,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Hamburger Menu'}}
>
  <ul><li>Option 1</li><li>Option 2</li></ul>
</Story>
