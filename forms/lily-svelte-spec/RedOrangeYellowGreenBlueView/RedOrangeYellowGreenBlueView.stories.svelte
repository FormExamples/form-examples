<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RedOrangeYellowGreenBlueView from './RedOrangeYellowGreenBlueView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/RedOrangeYellowGreenBlueView',
    component: RedOrangeYellowGreenBlueView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Red Orange Yellow Green Blue View'}}
/>
