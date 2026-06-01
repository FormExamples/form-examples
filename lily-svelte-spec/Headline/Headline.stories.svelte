<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Headline from './Headline.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Headline',
    component: Headline,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    level: 1
  }}
>
  Page headline
</Story>
