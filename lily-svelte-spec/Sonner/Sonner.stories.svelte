<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Sonner from './Sonner.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Sonner',
    component: Sonner,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Sonner'}}
>
  <p>Notification message</p>
</Story>
