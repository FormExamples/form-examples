<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import InfoState from './InfoState.svelte';

  const { Story } = defineMeta({
    title: 'Headless/InfoState',
    component: InfoState,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    level: 'empty',
    title: 'No results found',
    description: 'Try a different search term or filter.',
  }}
/>
