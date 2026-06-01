<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LiechtensteinNationalIdentityCardNumberInput from './LiechtensteinNationalIdentityCardNumberInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/LiechtensteinNationalIdentityCardNumberInput',
    component: LiechtensteinNationalIdentityCardNumberInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Liechtenstein National Identity Card Number Input'}}
/>
