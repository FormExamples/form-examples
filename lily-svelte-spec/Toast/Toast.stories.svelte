<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Toast from './Toast.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Toast',
    component: Toast,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Toast'}}
>
  <p>Notification message</p>
</Story>
