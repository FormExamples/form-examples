<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import IslandKennitalaView from './IslandKennitalaView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/IslandKennitalaView',
    component: IslandKennitalaView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Island Kennitala View'}}
/>
