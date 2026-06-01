<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import KanbanTable from './KanbanTable.svelte';

  const { Story } = defineMeta({
    title: 'Headless/KanbanTable',
    component: KanbanTable,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Kanban Table'}}
>
  <thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody>
</Story>
