<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DanmarkPersonnummerInput from './DanmarkPersonnummerInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DanmarkPersonnummerInput',
    component: DanmarkPersonnummerInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Danmark Personnummer Input'}}
/>
