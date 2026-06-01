<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TaskBarButton from './TaskBarButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TaskBarButton',
    component: TaskBarButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Click me</span>
</Story>
