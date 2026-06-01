<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SlideOutDrawer from './SlideOutDrawer.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SlideOutDrawer',
    component: SlideOutDrawer,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Slide Out Drawer'}}
>
  <p>Panel content</p>
</Story>
