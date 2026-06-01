<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ToolBarButton from './ToolBarButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ToolBarButton',
    component: ToolBarButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Click me</span>
</Story>
