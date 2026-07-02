<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import UnitedStatesSocialSecurityNumberInput from './UnitedStatesSocialSecurityNumberInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/UnitedStatesSocialSecurityNumberInput',
    component: UnitedStatesSocialSecurityNumberInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'United States Social Security Number Input'}}
/>
