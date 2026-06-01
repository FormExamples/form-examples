<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TaskList from './TaskList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TaskList',
    component: TaskList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Task List'}}
>
  <li>Item 1</li><li>Item 2</li>
</Story>
