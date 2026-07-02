<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LatvijaPersonasKodsInput from './LatvijaPersonasKodsInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/LatvijaPersonasKodsInput',
    component: LatvijaPersonasKodsInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Latvija Personas Kods Input'}}
/>
