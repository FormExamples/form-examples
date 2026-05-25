<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MonthInput from './MonthInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MonthInput',
    component: MonthInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Month Input'}}
/>
