<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NewsletterSignup from './NewsletterSignup.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NewsletterSignup',
    component: NewsletterSignup,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: 'Subscribe to newsletter',
    heading: 'Stay informed',
    description: 'Monthly product updates.',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    submitLabel: 'Subscribe',
    state: 'idle',
    successMessage: 'Thanks for subscribing!',
    errorMessage: 'Something went wrong. Please try again.',
  }}
/>
