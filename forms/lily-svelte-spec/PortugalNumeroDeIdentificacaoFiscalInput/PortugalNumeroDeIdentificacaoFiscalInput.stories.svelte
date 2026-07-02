<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PortugalNumeroDeIdentificacaoFiscalInput from './PortugalNumeroDeIdentificacaoFiscalInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PortugalNumeroDeIdentificacaoFiscalInput',
    component: PortugalNumeroDeIdentificacaoFiscalInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Portugal Numero De Identificacao Fiscal Input'}}
/>
