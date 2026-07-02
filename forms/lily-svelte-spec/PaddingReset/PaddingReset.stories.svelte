<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PaddingReset from './PaddingReset.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PaddingReset',
    component: PaddingReset,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{}}
>
  <p>Content rendered with the surrounding fluid padding removed.</p>
</Story>
