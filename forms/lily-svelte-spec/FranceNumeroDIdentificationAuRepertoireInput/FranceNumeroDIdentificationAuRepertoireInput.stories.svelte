<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FranceNumeroDIdentificationAuRepertoireInput from './FranceNumeroDIdentificationAuRepertoireInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FranceNumeroDIdentificationAuRepertoireInput',
    component: FranceNumeroDIdentificationAuRepertoireInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'France Numero D Identification Au Repertoire Input'}}
/>
