<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import IconButton from './IconButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/IconButton',
    component: IconButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Close' }}
>
  <span aria-hidden="true">×</span>
</Story>
