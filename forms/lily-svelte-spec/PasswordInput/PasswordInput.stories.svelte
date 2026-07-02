<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PasswordInput from './PasswordInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PasswordInput',
    component: PasswordInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Password Input'}}
/>
