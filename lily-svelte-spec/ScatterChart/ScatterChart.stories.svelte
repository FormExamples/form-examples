<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ScatterChart from './ScatterChart.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ScatterChart',
    component: ScatterChart,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'ScatterChart'}}
>
  <span>ScatterChart</span>
</Story>
