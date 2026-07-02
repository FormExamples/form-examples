<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ErrorMessage from './ErrorMessage.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ErrorMessage',
    component: ErrorMessage,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Error message</span>
</Story>
