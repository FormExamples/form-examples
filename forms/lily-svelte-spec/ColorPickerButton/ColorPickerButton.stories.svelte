<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ColorPickerButton from './ColorPickerButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ColorPickerButton',
    component: ColorPickerButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Color Picker Button'}}
/>
