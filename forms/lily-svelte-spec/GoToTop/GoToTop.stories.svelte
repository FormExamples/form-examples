<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GoToTop from './GoToTop.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GoToTop',
    component: GoToTop,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'GoToTop'}}
>
  <span>GoToTop</span>
</Story>
