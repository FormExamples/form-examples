<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import InformationCallout from './InformationCallout.svelte';

  const { Story } = defineMeta({
    title: 'Headless/InformationCallout',
    component: InformationCallout,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Information Callout'}}
>
  <p>This is important information.</p>
</Story>
