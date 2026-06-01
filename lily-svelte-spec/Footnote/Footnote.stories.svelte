<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Footnote from './Footnote.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Footnote',
    component: Footnote,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Footnote text</span>
</Story>
