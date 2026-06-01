<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EestiIsikukoodInput from './EestiIsikukoodInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/EestiIsikukoodInput',
    component: EestiIsikukoodInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Eesti Isikukood Input'}}
/>
