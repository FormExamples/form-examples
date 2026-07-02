<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AustraliaIndividualHealthcareIdentifierView from './AustraliaIndividualHealthcareIdentifierView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/AustraliaIndividualHealthcareIdentifierView',
    component: AustraliaIndividualHealthcareIdentifierView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Australia Individual Healthcare Identifier View'}}
/>
