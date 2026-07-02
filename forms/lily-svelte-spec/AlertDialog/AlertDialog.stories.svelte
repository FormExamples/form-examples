<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AlertDialog from './AlertDialog.svelte';

  const { Story } = defineMeta({
    title: 'Headless/AlertDialog',
    component: AlertDialog,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'title':'Alert Dialog'}}
>
  <p>Dialog content</p>
</Story>
