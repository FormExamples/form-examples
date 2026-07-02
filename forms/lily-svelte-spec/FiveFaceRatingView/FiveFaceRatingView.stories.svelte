<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FiveFaceRatingView from './FiveFaceRatingView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FiveFaceRatingView',
    component: FiveFaceRatingView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Five Face Rating View'}}
/>
