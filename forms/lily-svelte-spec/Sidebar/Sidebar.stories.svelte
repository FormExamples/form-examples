<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Sidebar from './Sidebar.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Sidebar',
    component: Sidebar,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Sidebar'}}
>
  <nav>Sidebar content</nav>
</Story>
