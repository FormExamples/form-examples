<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MeasurementInstanceView from './MeasurementInstanceView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MeasurementInstanceView',
    component: MeasurementInstanceView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Measurement Instance View'}}
/>
