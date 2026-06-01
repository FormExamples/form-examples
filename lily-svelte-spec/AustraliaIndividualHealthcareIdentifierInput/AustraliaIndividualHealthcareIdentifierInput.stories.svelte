<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AustraliaIndividualHealthcareIdentifierInput from './AustraliaIndividualHealthcareIdentifierInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/AustraliaIndividualHealthcareIdentifierInput',
    component: AustraliaIndividualHealthcareIdentifierInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Australia Individual Healthcare Identifier Input'}}
/>
