<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DateTimeNowInput from './DateTimeNowInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DateTimeNowInput',
    component: DateTimeNowInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Date Time Now Input'}}
/>
