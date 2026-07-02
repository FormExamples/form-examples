<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GanttTable from './GanttTable.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GanttTable',
    component: GanttTable,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Gantt Table'}}
>
  <thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody>
</Story>
