<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DateTimeLocalInput from './DateTimeLocalInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DateTimeLocalInput',
    component: DateTimeLocalInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'DateTime Local Input'}}
/>
