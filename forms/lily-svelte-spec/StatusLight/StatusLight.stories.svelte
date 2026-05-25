<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StatusLight from './StatusLight.svelte';

  const { Story } = defineMeta({
    title: 'Headless/StatusLight',
    component: StatusLight,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Active', variant: 'positive' }}
/>
