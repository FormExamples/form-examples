<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ToggleButton from './ToggleButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ToggleButton',
    component: ToggleButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Toggle Button'}}
>
  <span>Click me</span>
</Story>
