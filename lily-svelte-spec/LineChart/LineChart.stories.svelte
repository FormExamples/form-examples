<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LineChart from './LineChart.svelte';

  const { Story } = defineMeta({
    title: 'Headless/LineChart',
    component: LineChart,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'LineChart'}}
>
  <span>LineChart</span>
</Story>
