<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MenuItem from './MenuItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MenuItem',
    component: MenuItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Menu item</span>
</Story>
