<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PortugalNumeroDeIdentificacaoFiscalView from './PortugalNumeroDeIdentificacaoFiscalView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PortugalNumeroDeIdentificacaoFiscalView',
    component: PortugalNumeroDeIdentificacaoFiscalView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Portugal Numero De Identificacao Fiscal View'}}
/>
