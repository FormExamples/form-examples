<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Dialog from './Dialog.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Dialog',
    component: Dialog,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Dialog'}}
>
  <p>Dialog content</p>
</Story>
