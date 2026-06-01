<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MockupPhoneLandscape from './MockupPhoneLandscape.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MockupPhoneLandscape',
    component: MockupPhoneLandscape,
  });
</script>

<Story name="Default" tags={['autodocs', '!dev']}></Story>
