<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MenuBar from './MenuBar.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MenuBar',
    component: MenuBar,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Menu Bar'}}
>
  <ul><li>Option 1</li><li>Option 2</li></ul>
</Story>
