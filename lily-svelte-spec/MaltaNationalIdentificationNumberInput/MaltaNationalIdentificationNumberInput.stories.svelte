<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MaltaNationalIdentificationNumberInput from './MaltaNationalIdentificationNumberInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MaltaNationalIdentificationNumberInput',
    component: MaltaNationalIdentificationNumberInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Malta National Identification Number Input'}}
/>
