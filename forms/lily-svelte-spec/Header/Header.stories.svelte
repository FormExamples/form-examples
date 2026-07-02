<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Header from './Header.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Header',
    component: Header,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Header'}}
>
  <h1>Header</h1>
</Story>
