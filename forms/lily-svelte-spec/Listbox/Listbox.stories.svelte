<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Listbox from './Listbox.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Listbox',
    component: Listbox,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Listbox'}}
>
  <li>Item 1</li><li>Item 2</li>
</Story>
