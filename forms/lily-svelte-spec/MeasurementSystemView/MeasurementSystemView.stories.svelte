<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MeasurementSystemView from './MeasurementSystemView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MeasurementSystemView',
    component: MeasurementSystemView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Measurement System View'}}
/>
