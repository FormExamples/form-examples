<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TaskBar from './TaskBar.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TaskBar',
    component: TaskBar,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Task Bar'}}
>
  <p>Task Bar content</p>
</Story>
