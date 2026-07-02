<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CeskoCestovniPasInput from './CeskoCestovniPasInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CeskoCestovniPasInput',
    component: CeskoCestovniPasInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Cesko Cestovni Pas Input'}}
/>
