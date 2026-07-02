<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CharacterCounter from './CharacterCounter.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CharacterCounter',
    component: CharacterCounter,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Character Counter'}}
/>
