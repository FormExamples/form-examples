<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Drawer from './Drawer.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Drawer',
    component: Drawer,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Drawer'}}
>
  <p>Panel content</p>
</Story>
