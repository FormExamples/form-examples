<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MeasurementUnitInput from './MeasurementUnitInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MeasurementUnitInput',
    component: MeasurementUnitInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Measurement Unit Input'}}
/>
