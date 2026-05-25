<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import KanbanTableRow from './KanbanTableRow.svelte';

  const { Story } = defineMeta({
    title: 'Headless/KanbanTableRow',
    component: KanbanTableRow,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <td>Row data</td>
</Story>
