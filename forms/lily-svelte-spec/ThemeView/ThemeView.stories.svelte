<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ThemeView from './ThemeView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ThemeView',
    component: ThemeView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Theme View'}}
/>
