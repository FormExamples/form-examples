<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Byline from './Byline.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Byline',
    component: Byline,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{}}
>
  Karen Francis
</Story>
