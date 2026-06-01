<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NetPromoterScoreView from './NetPromoterScoreView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NetPromoterScoreView',
    component: NetPromoterScoreView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Net Promoter Score View'}}
/>
