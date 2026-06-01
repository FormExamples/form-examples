<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ColumnChart from './ColumnChart.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ColumnChart',
    component: ColumnChart,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'ColumnChart'}}
>
  <span>ColumnChart</span>
</Story>
