<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GanttTableTR from './GanttTableTR.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GanttTableTR',
    component: GanttTableTR,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <td>Row data</td>
</Story>
