<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RedAmberGreenPickerButton from './RedAmberGreenPickerButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/RedAmberGreenPickerButton',
    component: RedAmberGreenPickerButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Red Amber Green Picker Button'}}
/>
