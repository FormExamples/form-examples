<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Character from './Character.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Character',
    component: Character,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Character'}}
>
  <p>Character content</p>
</Story>
