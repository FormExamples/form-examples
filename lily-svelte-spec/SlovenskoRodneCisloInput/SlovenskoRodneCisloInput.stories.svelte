<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SlovenskoRodneCisloInput from './SlovenskoRodneCisloInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SlovenskoRodneCisloInput',
    component: SlovenskoRodneCisloInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Slovensko Rodne Cislo Input'}}
/>
