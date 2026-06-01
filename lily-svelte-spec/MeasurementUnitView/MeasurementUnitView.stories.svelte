<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MeasurementUnitView from './MeasurementUnitView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MeasurementUnitView',
    component: MeasurementUnitView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Measurement Unit View'}}
/>
