<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LietuvaAsmensKodasView from './LietuvaAsmensKodasView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/LietuvaAsmensKodasView',
    component: LietuvaAsmensKodasView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Lietuva Asmens Kodas View'}}
/>
