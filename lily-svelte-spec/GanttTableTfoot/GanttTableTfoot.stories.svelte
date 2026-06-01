<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GanttTableTfoot from './GanttTableTfoot.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GanttTableTfoot',
    component: GanttTableTfoot,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <tr><td>Footer</td></tr>
</Story>
