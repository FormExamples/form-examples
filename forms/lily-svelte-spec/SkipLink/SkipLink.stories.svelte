<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SkipLink from './SkipLink.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SkipLink',
    component: SkipLink,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Skip Link'}}
/>
