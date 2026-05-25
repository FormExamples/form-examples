<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DateInput from './DateInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DateInput',
    component: DateInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Date Input'}}
/>
