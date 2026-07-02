<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FiveFaceRatingPickerButton from './FiveFaceRatingPickerButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FiveFaceRatingPickerButton',
    component: FiveFaceRatingPickerButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Five Face Rating Picker Button'}}
/>
