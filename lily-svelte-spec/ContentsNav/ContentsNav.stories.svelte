<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ContentsNav from './ContentsNav.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ContentsNav',
    component: ContentsNav,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Contents Nav'}}
>
  <ul><li><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li></ul>
</Story>
