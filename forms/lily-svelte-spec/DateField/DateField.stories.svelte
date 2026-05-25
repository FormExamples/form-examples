<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DateField from './DateField.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DateField',
    component: DateField,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Date Field'}}
/>
