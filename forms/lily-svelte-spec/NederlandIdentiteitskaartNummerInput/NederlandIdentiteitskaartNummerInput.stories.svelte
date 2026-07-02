<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NederlandIdentiteitskaartNummerInput from './NederlandIdentiteitskaartNummerInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NederlandIdentiteitskaartNummerInput',
    component: NederlandIdentiteitskaartNummerInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Nederland Identiteitskaart Nummer Input'}}
/>
