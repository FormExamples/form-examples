<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CyprusNationalPassportNumberInput from './CyprusNationalPassportNumberInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CyprusNationalPassportNumberInput',
    component: CyprusNationalPassportNumberInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Cyprus National Passport Number Input'}}
/>
