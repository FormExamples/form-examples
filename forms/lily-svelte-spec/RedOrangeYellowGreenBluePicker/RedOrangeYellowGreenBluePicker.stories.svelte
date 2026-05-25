<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RedOrangeYellowGreenBluePicker from './RedOrangeYellowGreenBluePicker.svelte';

  const { Story } = defineMeta({
    title: 'Headless/RedOrangeYellowGreenBluePicker',
    component: RedOrangeYellowGreenBluePicker,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Red Orange Yellow Green Blue Picker'}}
/>
