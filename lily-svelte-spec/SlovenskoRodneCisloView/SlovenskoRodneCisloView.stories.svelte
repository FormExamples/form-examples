<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SlovenskoRodneCisloView from './SlovenskoRodneCisloView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SlovenskoRodneCisloView',
    component: SlovenskoRodneCisloView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Slovensko Rodne Cislo View'}}
/>
