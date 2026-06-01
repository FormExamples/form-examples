<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Blockquote from './Blockquote.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Blockquote',
    component: Blockquote,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ citationText: '— Jane Doe, A Book' }}
>
  <p>The best way to predict the future is to invent it.</p>
</Story>
