<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CallToAction from './CallToAction.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CallToAction',
    component: CallToAction,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Call To Action'}}
>
  <p>Call To Action content</p>
</Story>
