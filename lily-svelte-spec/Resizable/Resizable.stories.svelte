<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Resizable from './Resizable.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Resizable',
    component: Resizable,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Resizable'}}
>
  <div>Resizable content</div>
</Story>
