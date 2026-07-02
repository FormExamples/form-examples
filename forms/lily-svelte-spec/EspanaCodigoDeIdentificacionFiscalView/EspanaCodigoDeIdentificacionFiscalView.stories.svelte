<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EspanaCodigoDeIdentificacionFiscalView from './EspanaCodigoDeIdentificacionFiscalView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/EspanaCodigoDeIdentificacionFiscalView',
    component: EspanaCodigoDeIdentificacionFiscalView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Espana Codigo De Identificacion Fiscal View'}}
/>
