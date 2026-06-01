<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SlovenskoPasInput from './SlovenskoPasInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SlovenskoPasInput',
    component: SlovenskoPasInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Slovensko Pas Input'}}
/>
