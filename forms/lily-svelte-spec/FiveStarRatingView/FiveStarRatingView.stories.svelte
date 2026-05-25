<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FiveStarRatingView from './FiveStarRatingView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FiveStarRatingView',
    component: FiveStarRatingView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Five Star Rating View'}}
/>
