<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ToolBar from './ToolBar.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ToolBar',
    component: ToolBar,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Tool Bar'}}
>
  <p>Tool Bar content</p>
</Story>
