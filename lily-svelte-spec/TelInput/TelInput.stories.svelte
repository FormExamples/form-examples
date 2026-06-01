<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TelInput from './TelInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TelInput',
    component: TelInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Tel Input'}}
/>
