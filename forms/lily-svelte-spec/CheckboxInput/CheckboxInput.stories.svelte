<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CheckboxInput from './CheckboxInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CheckboxInput',
    component: CheckboxInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Checkbox Input'}}
/>
