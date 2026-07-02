<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SectionHeading from './SectionHeading.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SectionHeading',
    component: SectionHeading,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    eyebrow: 'Updates',
    heading: 'Latest news',
    subtitle: 'What we shipped this week',
    level: 2,
  }}
/>
