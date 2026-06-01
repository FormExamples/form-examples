<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import KanbanTableFoot from './KanbanTableFoot.svelte';

  const { Story } = defineMeta({
    title: 'Headless/KanbanTableFoot',
    component: KanbanTableFoot,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <tr><td>Footer</td></tr>
</Story>
