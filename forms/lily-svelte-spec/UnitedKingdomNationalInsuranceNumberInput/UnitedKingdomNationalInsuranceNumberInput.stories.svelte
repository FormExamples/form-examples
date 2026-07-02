<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import UnitedKingdomNationalInsuranceNumberInput from './UnitedKingdomNationalInsuranceNumberInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/UnitedKingdomNationalInsuranceNumberInput',
    component: UnitedKingdomNationalInsuranceNumberInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'United Kingdom National Insurance Number Input'}}
/>
