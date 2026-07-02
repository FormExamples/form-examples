<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FileUpload from './FileUpload.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FileUpload',
    component: FileUpload,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'File Upload'}}
/>
