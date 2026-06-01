<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TimeoutDialog from './TimeoutDialog.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TimeoutDialog',
    component: TimeoutDialog,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'TimeoutDialog'}}
>
  <span>TimeoutDialog</span>
</Story>
