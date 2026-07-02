<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MaltaNationalIdentificationNumberView from './MaltaNationalIdentificationNumberView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MaltaNationalIdentificationNumberView',
    component: MaltaNationalIdentificationNumberView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Malta National Identification Number View'}}
/>
