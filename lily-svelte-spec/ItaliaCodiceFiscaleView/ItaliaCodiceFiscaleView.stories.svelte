<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ItaliaCodiceFiscaleView from './ItaliaCodiceFiscaleView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ItaliaCodiceFiscaleView',
    component: ItaliaCodiceFiscaleView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Italia Codice Fiscale View'}}
/>
