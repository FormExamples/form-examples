<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TimelineList from './TimelineList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TimelineList',
    component: TimelineList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Timeline List'}}
>
  <li>Item 1</li><li>Item 2</li>
</Story>
