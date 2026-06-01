<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AngleSliderRangeInput from './AngleSliderRangeInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/AngleSliderRangeInput',
    component: AngleSliderRangeInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Angle Slider Range Input'}}
/>
