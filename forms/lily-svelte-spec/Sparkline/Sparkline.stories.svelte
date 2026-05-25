<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Sparkline from './Sparkline.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Sparkline',
    component: Sparkline,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Sparkline'}}
>
  <span>Sparkline data</span>
</Story>
