<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Popover from './Popover.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Popover',
    component: Popover,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Popover'}}
>
  <p>Popover content</p>
</Story>
