<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TreeNav from './TreeNav.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TreeNav',
    component: TreeNav,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Tree Nav'}}
>
  <ul><li><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li></ul>
</Story>
