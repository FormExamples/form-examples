<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import IrelandIndividualHealthIdentifierView from './IrelandIndividualHealthIdentifierView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/IrelandIndividualHealthIdentifierView',
    component: IrelandIndividualHealthIdentifierView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Ireland Individual Health Identifier View'}}
/>
