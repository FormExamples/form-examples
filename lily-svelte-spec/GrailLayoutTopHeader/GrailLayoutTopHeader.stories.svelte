<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GrailLayoutTopHeader from './GrailLayoutTopHeader.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GrailLayoutTopHeader',
    component: GrailLayoutTopHeader,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <h1>Header</h1>
</Story>
