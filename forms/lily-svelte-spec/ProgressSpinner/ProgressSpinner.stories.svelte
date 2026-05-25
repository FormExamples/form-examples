<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ProgressSpinner from './ProgressSpinner.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ProgressSpinner',
    component: ProgressSpinner,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Progress Spinner'}}
>
  <span>Loading...</span>
</Story>
