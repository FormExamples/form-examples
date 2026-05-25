<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GovernmentBanner from './GovernmentBanner.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GovernmentBanner',
    component: GovernmentBanner,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: 'Official government website',
    headerText: 'An official website of the United States government',
    expandLabel: "Here's how you know",
    expanded: false,
  }}
>
  <p>Official websites use .gov</p>
  <p>Secure .gov websites use HTTPS</p>
</Story>
