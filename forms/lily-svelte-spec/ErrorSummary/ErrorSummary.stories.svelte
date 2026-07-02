<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ErrorSummary from './ErrorSummary.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ErrorSummary',
    component: ErrorSummary,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'title':'Error Summary'}}
>
  <span>Error message</span>
</Story>
