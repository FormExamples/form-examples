<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GovernmentIdentifier from './GovernmentIdentifier.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GovernmentIdentifier',
    component: GovernmentIdentifier,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: 'Agency identifier',
    agencyName: 'U.S. Department of Example',
    agencyHref: 'https://example.gov',
    description: 'An official website of the U.S. Department of Example',
  }}
>
  <a href="/about">About</a>
  <a href="/accessibility">Accessibility</a>
  <a href="/foia">FOIA requests</a>
</Story>
