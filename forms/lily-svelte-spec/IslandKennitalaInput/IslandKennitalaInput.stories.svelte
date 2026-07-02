<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import IslandKennitalaInput from './IslandKennitalaInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/IslandKennitalaInput',
    component: IslandKennitalaInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Island Kennitala Input'}}
/>
