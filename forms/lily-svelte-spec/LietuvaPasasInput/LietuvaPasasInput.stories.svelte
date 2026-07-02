<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LietuvaPasasInput from './LietuvaPasasInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/LietuvaPasasInput',
    component: LietuvaPasasInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Lietuva Pasas Input'}}
/>
