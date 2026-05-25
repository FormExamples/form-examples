<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GoToPreviousSection from './GoToPreviousSection.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GoToPreviousSection',
    component: GoToPreviousSection,
  });
</script>

<Story name="Default" tags={['autodocs', '!dev']}></Story>
