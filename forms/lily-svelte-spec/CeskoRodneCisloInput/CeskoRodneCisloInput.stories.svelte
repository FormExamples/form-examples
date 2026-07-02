<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CeskoRodneCisloInput from './CeskoRodneCisloInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CeskoRodneCisloInput',
    component: CeskoRodneCisloInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Cesko Rodne Cislo Input'}}
/>
