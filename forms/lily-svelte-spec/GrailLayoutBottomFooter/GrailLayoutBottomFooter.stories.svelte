<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GrailLayoutBottomFooter from './GrailLayoutBottomFooter.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GrailLayoutBottomFooter',
    component: GrailLayoutBottomFooter,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <p>Footer content</p>
</Story>
