<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EestiIsikukoodView from './EestiIsikukoodView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/EestiIsikukoodView',
    component: EestiIsikukoodView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Eesti Isikukood View'}}
/>
