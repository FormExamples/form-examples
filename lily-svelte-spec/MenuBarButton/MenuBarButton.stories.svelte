<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MenuBarButton from './MenuBarButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MenuBarButton',
    component: MenuBarButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Click me</span>
</Story>
