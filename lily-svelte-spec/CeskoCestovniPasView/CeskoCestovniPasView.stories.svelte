<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CeskoCestovniPasView from './CeskoCestovniPasView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CeskoCestovniPasView',
    component: CeskoCestovniPasView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Cesko Cestovni Pas View'}}
/>
