<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ImageFileInput from './ImageFileInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ImageFileInput',
    component: ImageFileInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Image File Input'}}
/>
