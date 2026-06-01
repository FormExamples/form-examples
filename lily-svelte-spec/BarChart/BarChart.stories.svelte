<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BarChart from './BarChart.svelte';

  const { Story } = defineMeta({
    title: 'Headless/BarChart',
    component: BarChart,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'BarChart'}}
>
  <span>BarChart</span>
</Story>
