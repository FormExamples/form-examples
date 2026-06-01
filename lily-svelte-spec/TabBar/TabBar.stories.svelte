<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TabBar from './TabBar.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TabBar',
    component: TabBar,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Tab Bar'}}
>
  <p>Tab Bar content</p>
</Story>
