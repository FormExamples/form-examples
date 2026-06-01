<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LietuvaAsmensKodasInput from './LietuvaAsmensKodasInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/LietuvaAsmensKodasInput',
    component: LietuvaAsmensKodasInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Lietuva Asmens Kodas Input'}}
/>
