<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TelLink from './TelLink.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TelLink',
    component: TelLink,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Tel Link'}}
/>
