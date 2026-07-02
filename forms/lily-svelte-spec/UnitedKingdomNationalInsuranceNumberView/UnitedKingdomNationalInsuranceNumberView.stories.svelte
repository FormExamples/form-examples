<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import UnitedKingdomNationalInsuranceNumberView from './UnitedKingdomNationalInsuranceNumberView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/UnitedKingdomNationalInsuranceNumberView',
    component: UnitedKingdomNationalInsuranceNumberView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'United Kingdom National Insurance Number View'}}
/>
