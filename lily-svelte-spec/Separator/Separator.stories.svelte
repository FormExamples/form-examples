<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Separator from './Separator.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Separator',
    component: Separator,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Separator'}}
/>
