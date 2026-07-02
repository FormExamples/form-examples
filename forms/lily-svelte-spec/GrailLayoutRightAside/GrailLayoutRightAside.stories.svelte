<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GrailLayoutRightAside from './GrailLayoutRightAside.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GrailLayoutRightAside',
    component: GrailLayoutRightAside,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <p>Layout section content</p>
</Story>
