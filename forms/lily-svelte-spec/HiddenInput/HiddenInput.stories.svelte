<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import HiddenInput from './HiddenInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/HiddenInput',
    component: HiddenInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
/>
