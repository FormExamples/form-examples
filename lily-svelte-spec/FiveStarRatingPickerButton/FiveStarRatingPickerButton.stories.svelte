<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FiveStarRatingPickerButton from './FiveStarRatingPickerButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FiveStarRatingPickerButton',
    component: FiveStarRatingPickerButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Five Star Rating Picker Button'}}
/>
