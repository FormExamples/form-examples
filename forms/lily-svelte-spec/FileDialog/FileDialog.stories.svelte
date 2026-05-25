<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FileDialog from './FileDialog.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FileDialog',
    component: FileDialog,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'File Dialog'}}
>
  <p>Dialog content</p>
</Story>
