<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import WeekInput from './WeekInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/WeekInput',
    component: WeekInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Week Input'}}
/>
