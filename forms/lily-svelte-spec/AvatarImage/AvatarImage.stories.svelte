<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AvatarImage from './AvatarImage.svelte';

  const { Story } = defineMeta({
    title: 'Headless/AvatarImage',
    component: AvatarImage,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
/>
