<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ScrollerVideo from './ScrollerVideo.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ScrollerVideo',
    component: ScrollerVideo,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    src: "https://upload.wikimedia.org/wikipedia/commons/transcoded/8/8a/Big_Buck_Bunny_alt.webm/Big_Buck_Bunny_alt.webm.360p.webm",
    label: "Frame-scrub video",
    alt: "A demonstration animation that scrubs as the page scrolls."
  }}
>
  <section><p>Step 1</p></section>
  <section><p>Step 2</p></section>
  <section><p>Step 3</p></section>
</Story>
