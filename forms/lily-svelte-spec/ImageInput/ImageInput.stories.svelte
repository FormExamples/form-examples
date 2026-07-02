<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ImageInput from './ImageInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ImageInput',
    component: ImageInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
/>
