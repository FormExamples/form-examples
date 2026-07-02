<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PortugalPassaporteInput from './PortugalPassaporteInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PortugalPassaporteInput',
    component: PortugalPassaporteInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Portugal Passaporte Input'}}
/>
