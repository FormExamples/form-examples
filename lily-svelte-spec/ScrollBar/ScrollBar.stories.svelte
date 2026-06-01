<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ScrollBar from './ScrollBar.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ScrollBar',
    component: ScrollBar,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Scroll Bar'}}
>
  <p>Scrollable content area with enough text to scroll.</p>
</Story>
