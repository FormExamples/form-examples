<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RomaniaPasaportInput from './RomaniaPasaportInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/RomaniaPasaportInput',
    component: RomaniaPasaportInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Romania Pasaport Input'}}
/>
