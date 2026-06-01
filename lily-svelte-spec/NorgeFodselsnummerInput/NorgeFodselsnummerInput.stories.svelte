<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NorgeFodselsnummerInput from './NorgeFodselsnummerInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NorgeFodselsnummerInput',
    component: NorgeFodselsnummerInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Norge Fodselsnummer Input'}}
/>
