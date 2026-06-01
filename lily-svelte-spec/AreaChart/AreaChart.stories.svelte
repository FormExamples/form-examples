<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AreaChart from './AreaChart.svelte';

  const { Story } = defineMeta({
    title: 'Headless/AreaChart',
    component: AreaChart,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'AreaChart'}}
>
  <span>AreaChart</span>
</Story>
