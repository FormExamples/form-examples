<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import HoverCard from './HoverCard.svelte';

  const { Story } = defineMeta({
    title: 'Headless/HoverCard',
    component: HoverCard,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Hover Card'}}
>
  <p>Card content goes here.</p>
</Story>
