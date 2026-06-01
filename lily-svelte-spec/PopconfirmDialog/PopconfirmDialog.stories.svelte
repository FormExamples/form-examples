<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PopconfirmDialog from './PopconfirmDialog.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PopconfirmDialog',
    component: PopconfirmDialog,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    open: true,
    title: 'Delete this item?',
    description: 'This cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
  }}
/>
