<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EspanaTarjetaSanitariaIndividualView from './EspanaTarjetaSanitariaIndividualView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/EspanaTarjetaSanitariaIndividualView',
    component: EspanaTarjetaSanitariaIndividualView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Espana Tarjeta Sanitaria Individual View'}}
/>
