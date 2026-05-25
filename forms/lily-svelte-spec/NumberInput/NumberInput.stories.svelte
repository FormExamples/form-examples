<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NumberInput from './NumberInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NumberInput',
    component: NumberInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Number Input'}}
/>
