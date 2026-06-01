<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PolskaNumerIdentyfikacjiPodatkowejInput from './PolskaNumerIdentyfikacjiPodatkowejInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PolskaNumerIdentyfikacjiPodatkowejInput',
    component: PolskaNumerIdentyfikacjiPodatkowejInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Polska Numer Identyfikacji Podatkowej Input'}}
/>
