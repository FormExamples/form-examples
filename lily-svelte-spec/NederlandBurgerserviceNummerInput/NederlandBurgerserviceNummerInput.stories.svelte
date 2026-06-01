<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NederlandBurgerserviceNummerInput from './NederlandBurgerserviceNummerInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NederlandBurgerserviceNummerInput',
    component: NederlandBurgerserviceNummerInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Nederland Burgerservice Nummer Input'}}
/>
