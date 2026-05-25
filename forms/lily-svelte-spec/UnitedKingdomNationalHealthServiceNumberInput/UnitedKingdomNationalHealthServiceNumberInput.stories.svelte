<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import UnitedKingdomNationalHealthServiceNumberInput from './UnitedKingdomNationalHealthServiceNumberInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/UnitedKingdomNationalHealthServiceNumberInput',
    component: UnitedKingdomNationalHealthServiceNumberInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'United Kingdom National Health Service Number Input'}}
/>
