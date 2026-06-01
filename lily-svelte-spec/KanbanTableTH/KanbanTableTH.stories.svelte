<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import KanbanTableTD from './KanbanTableTD.svelte';

  const { Story } = defineMeta({
    title: 'Headless/KanbanTableTD',
    component: KanbanTableTD,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
/>
