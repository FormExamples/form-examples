<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LatvijaPersonasKodsView from './LatvijaPersonasKodsView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/LatvijaPersonasKodsView',
    component: LatvijaPersonasKodsView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Latvija Personas Kods View'}}
/>
