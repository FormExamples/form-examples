<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TimePickerInput from './TimePickerInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TimePickerInput',
    component: TimePickerInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Time Picker Input'}}
/>
