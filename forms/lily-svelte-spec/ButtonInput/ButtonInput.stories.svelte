<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ButtonInput from './ButtonInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ButtonInput',
    component: ButtonInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Button Input'}}
/>
