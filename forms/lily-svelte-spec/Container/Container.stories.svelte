<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Container from './Container.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Container',
    component: Container,
  });
</script>

<Story name="Default" tags={['autodocs', '!dev']}></Story>
