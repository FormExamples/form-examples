<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FileInput from './FileInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FileInput',
    component: FileInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'File Input'}}
/>
