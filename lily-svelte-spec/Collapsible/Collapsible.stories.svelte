<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Collapsible from './Collapsible.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Collapsible',
    component: Collapsible,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <p>Expandable content</p>
</Story>
