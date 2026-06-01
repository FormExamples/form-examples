<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PolskaPeselInput from './PolskaPeselInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PolskaPeselInput',
    component: PolskaPeselInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Polska Pesel Input'}}
/>
