<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ClipboardCopyButton from './ClipboardCopyButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ClipboardCopyButton',
    component: ClipboardCopyButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Clipboard Copy Button'}}
>
  <span>Click me</span>
</Story>
