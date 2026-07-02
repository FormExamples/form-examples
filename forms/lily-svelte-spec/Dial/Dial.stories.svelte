<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Dial from './Dial.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Dial',
    component: Dial,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Dial'}}
/>
