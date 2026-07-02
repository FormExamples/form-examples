<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DateRange from './DateRange.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DateRange',
    component: DateRange,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Date Range'}}
/>
