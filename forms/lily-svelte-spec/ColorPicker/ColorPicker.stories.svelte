<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ColorPicker from './ColorPicker.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ColorPicker',
    component: ColorPicker,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Color Picker'}}
/>
