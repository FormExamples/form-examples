<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FiveFaceRatingPicker from './FiveFaceRatingPicker.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FiveFaceRatingPicker',
    component: FiveFaceRatingPicker,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Five Face Rating Picker'}}
/>
