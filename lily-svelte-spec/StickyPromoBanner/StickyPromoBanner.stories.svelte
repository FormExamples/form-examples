<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StickyPromoBanner from './StickyPromoBanner.svelte';

  const { Story } = defineMeta({
    title: 'Headless/StickyPromoBanner',
    component: StickyPromoBanner,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: 'Promotional banner',
    dismissLabel: 'Dismiss banner',
    position: 'bottom',
    open: true,
  }}
>
  <p>Special offer: free shipping this week.</p>
</Story>
