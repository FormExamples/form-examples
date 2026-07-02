<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ThemeProvider from './ThemeProvider.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ThemeProvider',
    component: ThemeProvider,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    theme: {"color":{"primary":"#2563eb"},"space":{"md":"1rem"}},
    base: "light"
  }}
>
  <p>Children inherit the theme as CSS custom properties.</p>
</Story>
