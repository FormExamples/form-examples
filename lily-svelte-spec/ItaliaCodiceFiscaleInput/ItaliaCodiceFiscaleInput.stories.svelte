<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ItaliaCodiceFiscaleInput from './ItaliaCodiceFiscaleInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ItaliaCodiceFiscaleInput',
    component: ItaliaCodiceFiscaleInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Italia Codice Fiscale Input'}}
/>
