<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FlexStack from './FlexStack.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FlexStack',
    component: FlexStack,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ direction: 'column', gap: '1rem' }}
>
  <span>One</span>
  <span>Two</span>
  <span>Three</span>
</Story>
