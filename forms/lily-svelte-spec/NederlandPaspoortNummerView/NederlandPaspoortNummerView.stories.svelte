<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NederlandPaspoortNummerView from './NederlandPaspoortNummerView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NederlandPaspoortNummerView',
    component: NederlandPaspoortNummerView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Nederland Paspoort Nummer View'}}
/>
