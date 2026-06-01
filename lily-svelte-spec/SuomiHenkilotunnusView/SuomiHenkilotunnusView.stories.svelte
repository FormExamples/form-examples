<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SuomiHenkilotunnusView from './SuomiHenkilotunnusView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SuomiHenkilotunnusView',
    component: SuomiHenkilotunnusView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Suomi Henkilotunnus View'}}
/>
