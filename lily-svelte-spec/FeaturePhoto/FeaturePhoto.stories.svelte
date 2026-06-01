<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FeaturePhoto from './FeaturePhoto.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FeaturePhoto',
    component: FeaturePhoto,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    src: "https://placehold.co/600x400",
    alt: "Sample feature photo"
  }}
/>
