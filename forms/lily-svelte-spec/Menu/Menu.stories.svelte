<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Menu from './Menu.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Menu',
    component: Menu,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Menu'}}
>
  <ul><li>Option 1</li><li>Option 2</li></ul>
</Story>
