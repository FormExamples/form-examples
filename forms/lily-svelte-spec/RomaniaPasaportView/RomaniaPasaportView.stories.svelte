<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RomaniaPasaportView from './RomaniaPasaportView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/RomaniaPasaportView',
    component: RomaniaPasaportView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Romania Pasaport View'}}
/>
