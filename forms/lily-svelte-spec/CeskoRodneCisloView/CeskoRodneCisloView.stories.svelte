<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CeskoRodneCisloView from './CeskoRodneCisloView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CeskoRodneCisloView',
    component: CeskoRodneCisloView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Cesko Rodne Cislo View'}}
/>
