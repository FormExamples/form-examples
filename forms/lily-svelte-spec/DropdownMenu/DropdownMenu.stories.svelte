<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DropdownMenu from './DropdownMenu.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DropdownMenu',
    component: DropdownMenu,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Dropdown Menu'}}
>
  <ul><li>Option 1</li><li>Option 2</li></ul>
</Story>
