<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Statistic from './Statistic.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Statistic',
    component: Statistic,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ title: 'Active users', value: '1,234' }}
/>
