<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import WarningCallout from './WarningCallout.svelte';

  const { Story } = defineMeta({
    title: 'Headless/WarningCallout',
    component: WarningCallout,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Warning Callout'}}
>
  <p>This is important information.</p>
</Story>
