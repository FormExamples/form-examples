<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ImageCropper from './ImageCropper.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ImageCropper',
    component: ImageCropper,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Image Cropper'}}
>
  <p>Crop region</p>
</Story>
