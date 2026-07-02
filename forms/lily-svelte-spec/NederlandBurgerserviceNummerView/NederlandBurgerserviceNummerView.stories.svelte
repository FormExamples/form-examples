<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NederlandBurgerserviceNummerView from './NederlandBurgerserviceNummerView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NederlandBurgerserviceNummerView',
    component: NederlandBurgerserviceNummerView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Nederland Burgerservice Nummer View'}}
/>
