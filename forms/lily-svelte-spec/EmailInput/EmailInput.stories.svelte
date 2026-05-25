<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EmailInput from './EmailInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/EmailInput',
    component: EmailInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Email Input'}}
/>
