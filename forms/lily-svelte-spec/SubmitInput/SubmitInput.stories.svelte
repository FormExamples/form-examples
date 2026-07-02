<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SubmitInput from './SubmitInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SubmitInput',
    component: SubmitInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
/>
