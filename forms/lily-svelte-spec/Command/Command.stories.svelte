<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Command from './Command.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Command',
    component: Command,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Command'}}
>
  <p>Search commands...</p>
</Story>
