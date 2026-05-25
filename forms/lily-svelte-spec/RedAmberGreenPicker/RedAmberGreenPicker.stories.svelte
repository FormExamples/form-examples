<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RedAmberGreenPicker from './RedAmberGreenPicker.svelte';

  const { Story } = defineMeta({
    title: 'Headless/RedAmberGreenPicker',
    component: RedAmberGreenPicker,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Red Amber Green Picker'}}
/>
