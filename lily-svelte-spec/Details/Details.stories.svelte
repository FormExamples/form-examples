<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Details from './Details.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Details',
    component: Details,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <p>Expandable content</p>
</Story>
