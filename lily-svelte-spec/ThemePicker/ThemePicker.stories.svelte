<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ThemePicker from './ThemePicker.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ThemePicker',
    component: ThemePicker,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Theme Picker'}}
>
  <p>Picker content</p>
</Story>
