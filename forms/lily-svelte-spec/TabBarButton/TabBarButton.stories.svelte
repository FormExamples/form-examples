<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TabBarButton from './TabBarButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TabBarButton',
    component: TabBarButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Click me</span>
</Story>
