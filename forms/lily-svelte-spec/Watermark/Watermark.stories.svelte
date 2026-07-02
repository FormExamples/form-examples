<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Watermark from './Watermark.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Watermark',
    component: Watermark,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ text: 'Confidential', gap: '100px', rotate: -22 }}
>
  <article>
    <p>Document content beneath the watermark.</p>
  </article>
</Story>
