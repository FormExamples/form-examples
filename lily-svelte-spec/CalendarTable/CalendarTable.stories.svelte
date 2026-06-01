<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CalendarTable from './CalendarTable.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CalendarTable',
    component: CalendarTable,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Calendar Table'}}
>
  <thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody>
</Story>
