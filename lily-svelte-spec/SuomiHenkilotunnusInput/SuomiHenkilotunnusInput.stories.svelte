<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SuomiHenkilotunnusInput from './SuomiHenkilotunnusInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SuomiHenkilotunnusInput',
    component: SuomiHenkilotunnusInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Suomi Henkilotunnus Input'}}
/>
