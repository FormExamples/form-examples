<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LiechtensteinPassportNumberInput from './LiechtensteinPassportNumberInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/LiechtensteinPassportNumberInput',
    component: LiechtensteinPassportNumberInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Liechtenstein Passport Number Input'}}
/>
