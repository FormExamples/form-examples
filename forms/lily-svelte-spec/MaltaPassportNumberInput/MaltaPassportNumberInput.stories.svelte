<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MaltaPassportNumberInput from './MaltaPassportNumberInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MaltaPassportNumberInput',
    component: MaltaPassportNumberInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Malta Passport Number Input'}}
/>
