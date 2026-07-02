<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NederlandPaspoortNummerInput from './NederlandPaspoortNummerInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NederlandPaspoortNummerInput',
    component: NederlandPaspoortNummerInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Nederland Paspoort Nummer Input'}}
/>
