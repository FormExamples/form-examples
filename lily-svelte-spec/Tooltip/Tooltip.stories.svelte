<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Tooltip from './Tooltip.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Tooltip',
    component: Tooltip,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Tooltip'}}
/>
