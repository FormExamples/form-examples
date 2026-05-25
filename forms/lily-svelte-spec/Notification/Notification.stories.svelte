<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Notification from './Notification.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Notification',
    component: Notification,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Notification'}}
>
  <p>Notification message</p>
</Story>
