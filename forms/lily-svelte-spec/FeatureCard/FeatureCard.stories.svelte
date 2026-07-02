<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FeatureCard from './FeatureCard.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FeatureCard',
    component: FeatureCard,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    heading: 'Privacy first',
    description: 'Your data stays yours.',
    imagePosition: 'start',
  }}
>
  <a href="/learn">Learn more</a>
</Story>
