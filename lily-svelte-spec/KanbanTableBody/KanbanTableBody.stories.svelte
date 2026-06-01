<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import KanbanTableBody from './KanbanTableBody.svelte';

  const { Story } = defineMeta({
    title: 'Headless/KanbanTableBody',
    component: KanbanTableBody,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <tr><td>Data</td></tr>
</Story>
