<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VideoPlayer from './VideoPlayer.svelte';

  const { Story } = defineMeta({
    title: 'Headless/VideoPlayer',
    component: VideoPlayer,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/8/8a/Big_Buck_Bunny_alt.webm/Big_Buck_Bunny_alt.webm.360p.webm",
    label: "Demo video"
  }}
/>
