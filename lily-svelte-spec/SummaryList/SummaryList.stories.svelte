<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SummaryList from './SummaryList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SummaryList',
    component: SummaryList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Summary List'}}
>
  <li>Item 1</li><li>Item 2</li>
</Story>
