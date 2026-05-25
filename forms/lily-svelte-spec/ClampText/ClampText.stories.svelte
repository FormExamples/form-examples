<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ClampText from './ClampText.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ClampText',
    component: ClampText,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ lines: 2 }}
>
  <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
</Story>
