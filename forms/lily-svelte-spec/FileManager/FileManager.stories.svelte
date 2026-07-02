<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FileManager from './FileManager.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FileManager',
    component: FileManager,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'File Manager'}}
>
  <p>File Manager content</p>
</Story>
