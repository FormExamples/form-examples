<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GanttTableTD from './GanttTableTD.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GanttTableTD',
    component: GanttTableTD,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Cell data</span>
</Story>
