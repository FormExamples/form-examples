<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ContextMenuItem from './ContextMenuItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ContextMenuItem',
    component: ContextMenuItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Menu item</span>
</Story>
