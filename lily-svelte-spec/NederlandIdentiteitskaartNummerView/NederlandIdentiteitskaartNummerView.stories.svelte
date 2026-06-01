<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NederlandIdentiteitskaartNummerView from './NederlandIdentiteitskaartNummerView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NederlandIdentiteitskaartNummerView',
    component: NederlandIdentiteitskaartNummerView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Nederland Identiteitskaart Nummer View'}}
/>
