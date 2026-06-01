<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import HrvatskaOsobniIdentifikacijskiBrojInput from './HrvatskaOsobniIdentifikacijskiBrojInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/HrvatskaOsobniIdentifikacijskiBrojInput',
    component: HrvatskaOsobniIdentifikacijskiBrojInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Hrvatska Osobni Identifikacijski Broj Input'}}
/>
