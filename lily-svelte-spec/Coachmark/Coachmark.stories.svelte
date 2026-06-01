<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Coachmark from './Coachmark.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Coachmark',
    component: Coachmark,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    open: true,
    title: 'New feature',
    description: 'Try the new dashboard.',
    dismissLabel: 'Dismiss',
  }}
/>
