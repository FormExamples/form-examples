<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PhotoPack from './PhotoPack.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PhotoPack',
    component: PhotoPack,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: "Photo collection"
  }}
>
  <img src="https://placehold.co/300x200" alt="" />
  <img src="https://placehold.co/300x200" alt="" />
  <img src="https://placehold.co/300x200" alt="" />
</Story>
