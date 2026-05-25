<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TimeInput from './TimeInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TimeInput',
    component: TimeInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Time Input'}}
/>
