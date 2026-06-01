<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GoToNextSection from './GoToNextSection.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GoToNextSection',
    component: GoToNextSection,
  });
</script>

<Story name="Default" tags={['autodocs', '!dev']}></Story>
