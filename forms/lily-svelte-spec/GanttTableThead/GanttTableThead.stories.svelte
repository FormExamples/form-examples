<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GanttTableHead from './GanttTableHead.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GanttTableHead',
    component: GanttTableHead,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <tr><th>Header</th></tr>
</Story>
