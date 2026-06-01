<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EspanaCodigoDeIdentificacionFiscalInput from './EspanaCodigoDeIdentificacionFiscalInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/EspanaCodigoDeIdentificacionFiscalInput',
    component: EspanaCodigoDeIdentificacionFiscalInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Espana Codigo De Identificacion Fiscal Input'}}
/>
