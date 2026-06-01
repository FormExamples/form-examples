<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import UnitedKingdomNationalHealthServiceNumberView from './UnitedKingdomNationalHealthServiceNumberView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/UnitedKingdomNationalHealthServiceNumberView',
    component: UnitedKingdomNationalHealthServiceNumberView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'United Kingdom National Health Service Number View'}}
/>
