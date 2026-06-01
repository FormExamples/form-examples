<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Popup from './Popup.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Popup',
    component: Popup,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Popup'}}
>
  <p>Popover content</p>
</Story>
