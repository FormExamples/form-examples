<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GanttTableBody from './GanttTableBody.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GanttTableBody',
    component: GanttTableBody,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <tr><td>Data</td></tr>
</Story>
