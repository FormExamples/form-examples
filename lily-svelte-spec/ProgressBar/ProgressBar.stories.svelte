<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ProgressBar from './ProgressBar.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ProgressBar',
    component: ProgressBar,
  });
</script>

<Story name="Default" tags={['autodocs', '!dev']}></Story>
