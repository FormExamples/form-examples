<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import HorizontalScroller from './HorizontalScroller.svelte';

  const { Story } = defineMeta({
    title: 'Headless/HorizontalScroller',
    component: HorizontalScroller,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: "Featured items"
  }}
>
  <div style="display: flex; gap: 1rem;">
    <div style="min-width: 16rem;">Item 1</div>
    <div style="min-width: 16rem;">Item 2</div>
    <div style="min-width: 16rem;">Item 3</div>
  </div>
</Story>
