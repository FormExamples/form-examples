<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PolskaNumerIdentyfikacjiPodatkowejView from './PolskaNumerIdentyfikacjiPodatkowejView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PolskaNumerIdentyfikacjiPodatkowejView',
    component: PolskaNumerIdentyfikacjiPodatkowejView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Polska Numer Identyfikacji Podatkowej View'}}
/>
