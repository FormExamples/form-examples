<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import HeroHeadline from './HeroHeadline.svelte';

  const { Story } = defineMeta({
    title: 'Headless/HeroHeadline',
    component: HeroHeadline,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: "Welcome to Lily"
  }}
>
  {#snippet media()}
    <img src="https://placehold.co/1200x400" alt="" />
  {/snippet}
  <p>An accessible, headless component system.</p>
</Story>
