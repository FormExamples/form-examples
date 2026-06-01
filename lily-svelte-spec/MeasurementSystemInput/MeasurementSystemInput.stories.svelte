<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MeasurementSystemInput from './MeasurementSystemInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MeasurementSystemInput',
    component: MeasurementSystemInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Measurement System Input'}}
/>
