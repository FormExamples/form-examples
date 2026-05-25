<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import IrelandIndividualHealthIdentifierInput from './IrelandIndividualHealthIdentifierInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/IrelandIndividualHealthIdentifierInput',
    component: IrelandIndividualHealthIdentifierInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Ireland Individual Health Identifier Input'}}
/>
