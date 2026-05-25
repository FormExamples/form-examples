<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RedOrangeYellowGreenBluePickerButton from './RedOrangeYellowGreenBluePickerButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/RedOrangeYellowGreenBluePickerButton',
    component: RedOrangeYellowGreenBluePickerButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Red Orange Yellow Green Blue Picker Button'}}
/>
