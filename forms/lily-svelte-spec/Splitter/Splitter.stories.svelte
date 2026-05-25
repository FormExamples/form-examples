<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Splitter from './Splitter.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Splitter',
    component: Splitter,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Splitter'}}
/>
