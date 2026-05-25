<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RadioInput from './RadioInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/RadioInput',
    component: RadioInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Radio Input'}}
/>
