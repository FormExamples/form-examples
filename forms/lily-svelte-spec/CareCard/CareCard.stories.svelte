<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CareCard from './CareCard.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CareCard',
    component: CareCard,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Care Card','heading':'Care Card Heading'}}
>
  <p>Card content goes here.</p>
</Story>
