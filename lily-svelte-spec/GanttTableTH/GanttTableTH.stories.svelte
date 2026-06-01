<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GanttTableTH from './GanttTableTH.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GanttTableTH',
    component: GanttTableTH,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
/>
