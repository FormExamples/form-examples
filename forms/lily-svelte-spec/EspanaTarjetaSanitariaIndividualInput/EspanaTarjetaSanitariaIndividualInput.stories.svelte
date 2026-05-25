<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EspanaTarjetaSanitariaIndividualInput from './EspanaTarjetaSanitariaIndividualInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/EspanaTarjetaSanitariaIndividualInput',
    component: EspanaTarjetaSanitariaIndividualInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Espana Tarjeta Sanitaria Individual Input'}}
/>
