<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FranceNumeroDIdentificationAuRepertoireView from './FranceNumeroDIdentificationAuRepertoireView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FranceNumeroDIdentificationAuRepertoireView',
    component: FranceNumeroDIdentificationAuRepertoireView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'France Numero D Identification Au Repertoire View'}}
/>
