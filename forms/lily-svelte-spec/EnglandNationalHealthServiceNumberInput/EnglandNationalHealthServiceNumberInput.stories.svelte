<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EnglandNationalHealthServiceNumberInput from './EnglandNationalHealthServiceNumberInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/EnglandNationalHealthServiceNumberInput',
    component: EnglandNationalHealthServiceNumberInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'England National Health Service Number Input'}}
/>
