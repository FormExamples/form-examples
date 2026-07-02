<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NorthernIrelandHealthAndCareNumberView from './NorthernIrelandHealthAndCareNumberView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NorthernIrelandHealthAndCareNumberView',
    component: NorthernIrelandHealthAndCareNumberView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Northern Ireland Health And Care Number View'}}
/>
