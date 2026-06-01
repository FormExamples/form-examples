<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NorthernIrelandHealthAndCareNumberInput from './NorthernIrelandHealthAndCareNumberInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NorthernIrelandHealthAndCareNumberInput',
    component: NorthernIrelandHealthAndCareNumberInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Northern Ireland Health And Care Number Input'}}
/>
