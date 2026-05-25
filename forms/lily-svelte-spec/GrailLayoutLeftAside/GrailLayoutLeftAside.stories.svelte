<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GrailLayoutLeftAside from './GrailLayoutLeftAside.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GrailLayoutLeftAside',
    component: GrailLayoutLeftAside,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <p>Layout section content</p>
</Story>
