<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Combobox from './Combobox.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Combobox',
    component: Combobox,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Combobox'}}
>
  <p>Combobox content</p>
</Story>
