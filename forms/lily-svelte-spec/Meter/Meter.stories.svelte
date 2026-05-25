<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Meter from './Meter.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Meter',
    component: Meter,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Meter'}}
/>
