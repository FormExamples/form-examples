<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RomaniaCodNumericPersonalInput from './RomaniaCodNumericPersonalInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/RomaniaCodNumericPersonalInput',
    component: RomaniaCodNumericPersonalInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Romania Cod Numeric Personal Input'}}
/>
